use axum::body::Body;
use axum::extract::State;
use axum::http::{Request, StatusCode, header};
use axum::middleware::Next;
use axum::response::Response;

use crate::state::AppState;

/// Pure on purpose — trivial to unit test without spinning up axum or Redis.
pub fn is_authorized(header_value: Option<&str>, expected_token: &str) -> bool {
    header_value
        .and_then(|v| v.strip_prefix("Bearer "))
        .is_some_and(|token| token == expected_token)
}

/// Service-level auth: every route requires `Authorization: Bearer
/// <GAUGE_API_TOKEN>`. This proves the caller holds a valid credential to
/// talk to gauge-api at all — it does NOT prove the caller is the specific
/// user named in a request path (PUT /users/:id/settings still trusts :id
/// once past this gate). Real per-user identity needs a real auth provider
/// decision (session, OAuth, whatever) that hasn't been made; this closes
/// "anyone on the network can call any endpoint," not "can user X act as
/// user Y."
pub async fn require_api_token(
    State(state): State<AppState>,
    request: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let header_value = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok());
    if is_authorized(header_value, &state.api_token) {
        Ok(next.run(request).await)
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_the_matching_bearer_token() {
        assert!(is_authorized(Some("Bearer secret123"), "secret123"));
    }

    #[test]
    fn rejects_a_missing_header() {
        assert!(!is_authorized(None, "secret123"));
    }

    #[test]
    fn rejects_the_wrong_token() {
        assert!(!is_authorized(Some("Bearer wrong"), "secret123"));
    }

    #[test]
    fn rejects_a_non_bearer_scheme() {
        assert!(!is_authorized(Some("Basic secret123"), "secret123"));
    }
}
