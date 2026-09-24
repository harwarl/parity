# Starts/stops the gauge-* backend services for local dev.
#
# gauge-api connects to Redis at startup and refuses to start without one —
# `make up` checks for it first and fails fast with a clear message rather
# than letting it panic. gauge-api used to be three separate binaries
# (gauge-market, gauge-carder, gauge-api) talking over Redis and HTTP; they're
# folded into one deployable now (see gauge-api/src/main.rs) — gauge-exec
# stays its own service on purpose, since it's the one that will hold real
# MCP credentials and shouldn't share a process/crash domain with anything
# else.
#
# gauge-notif is still a stub today (no server loop yet): it connects,
# prints a line, and exits almost immediately. `make status` right after
# `make up` will show it as stopped — that's today's real state, not a bug
# here. gauge-exec and gauge-api are real long-running servers.

SHELL := /bin/bash
RUN_DIR := .run

REDIS_URL ?= redis://127.0.0.1:6379
GAUGE_API_ADDR ?= 127.0.0.1:8080
GAUGE_EXEC_ADDR ?= 127.0.0.1:8082
GAUGE_EXEC_URL ?= http://$(GAUGE_EXEC_ADDR)
# Dev-only default — gauge-api refuses to start without one at all (see its
# main.rs). Override with `GAUGE_API_TOKEN=... make up` for anything that
# isn't purely local.
GAUGE_API_TOKEN ?= dev-token

SERVICES := exec api notif

ENV_exec  := GAUGE_EXEC_ADDR=$(GAUGE_EXEC_ADDR)
ENV_api   := REDIS_URL=$(REDIS_URL) GAUGE_API_TOKEN=$(GAUGE_API_TOKEN) GAUGE_API_ADDR=$(GAUGE_API_ADDR) GAUGE_EXEC_URL=$(GAUGE_EXEC_URL)
ENV_notif :=

.PHONY: help build redis-check up down restart status logs clean

help:
	@echo "make up            build, then start every gauge-* service in the background"
	@echo "make down          stop every service this Makefile started"
	@echo "make restart       down, then up"
	@echo "make status        show which services are running"
	@echo "make logs          tail every service's log"
	@echo "make logs-api      tail one service's log (exec/api/notif)"
	@echo "make build         cargo build --workspace"
	@echo "make redis-check   fail fast with a clear message if Redis isn't reachable"
	@echo "make clean         down, then remove $(RUN_DIR)/"

build:
	cargo build --workspace

redis-check:
	@redis-cli -u "$(REDIS_URL)" ping > /dev/null 2>&1 || { \
		echo "Redis isn't reachable at $(REDIS_URL) — gauge-api requires it at startup."; \
		echo "Start one with: redis-server   (or: brew services start redis)"; \
		exit 1; \
	}

$(RUN_DIR):
	@mkdir -p $(RUN_DIR)

up: build redis-check $(RUN_DIR)
	@$(MAKE) --no-print-directory start-exec
	@$(MAKE) --no-print-directory start-api
	@$(MAKE) --no-print-directory start-notif
	@echo ""
	@$(MAKE) --no-print-directory status

# One rule handles all three services — $* is the short name (exec, api,
# notif); ENV_$* supplies that service's env vars (see above).
start-%: $(RUN_DIR)
	@if [ -f $(RUN_DIR)/$*.pid ] && kill -0 "$$(cat $(RUN_DIR)/$*.pid)" 2>/dev/null; then \
		echo "gauge-$* already running (pid $$(cat $(RUN_DIR)/$*.pid))"; \
	else \
		$(ENV_$*) ./target/debug/gauge-$* > $(RUN_DIR)/$*.log 2>&1 & \
		echo $$! > $(RUN_DIR)/$*.pid; \
		sleep 0.2; \
		echo "started gauge-$* (pid $$(cat $(RUN_DIR)/$*.pid)), log: $(RUN_DIR)/$*.log"; \
	fi

down:
	@for s in $(SERVICES); do \
		if [ -f $(RUN_DIR)/$$s.pid ]; then \
			pid=$$(cat $(RUN_DIR)/$$s.pid); \
			if kill -0 "$$pid" 2>/dev/null; then \
				kill "$$pid" && echo "stopped gauge-$$s (pid $$pid)"; \
			else \
				echo "gauge-$$s not running (stale pid file)"; \
			fi; \
			rm -f $(RUN_DIR)/$$s.pid; \
		else \
			echo "gauge-$$s not running"; \
		fi; \
	done

restart:
	@$(MAKE) --no-print-directory down
	@$(MAKE) --no-print-directory up

status:
	@for s in $(SERVICES); do \
		if [ -f $(RUN_DIR)/$$s.pid ] && kill -0 "$$(cat $(RUN_DIR)/$$s.pid)" 2>/dev/null; then \
			echo "  gauge-$$s: running (pid $$(cat $(RUN_DIR)/$$s.pid))"; \
		else \
			echo "  gauge-$$s: stopped"; \
		fi; \
	done

logs:
	@tail -f $(RUN_DIR)/*.log

logs-%:
	@tail -f $(RUN_DIR)/$*.log

clean: down
	@rm -rf $(RUN_DIR)
