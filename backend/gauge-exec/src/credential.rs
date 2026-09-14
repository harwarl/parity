use zeroize::Zeroizing;

/// A credential held as plaintext for exactly one call, never longer
/// (ARCHITECTURE.md §2.5: "decrypted only at point of use, never held
/// plaintext longer than the call"). No `Debug`/`Display` on purpose — that
/// closes off the easiest way to accidentally log a secret. The plaintext
/// buffer is zeroized as soon as it's consumed.
pub struct Credential(Zeroizing<String>);

impl Credential {
    /// Takes ownership of an already-decrypted secret. Decrypt right before
    /// calling this, not earlier — this type only protects what happens
    /// after it exists, not before.
    pub fn from_plaintext(secret: String) -> Self {
        Self(Zeroizing::new(secret))
    }

    /// Exposes the plaintext to `f` for exactly this call, then drops (and
    /// zeroizes) it. Consumes `self` so it can't be reused for a second call.
    pub fn use_once<T>(self, f: impl FnOnce(&str) -> T) -> T {
        f(&self.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn use_once_exposes_the_plaintext_to_the_closure() {
        let cred = Credential::from_plaintext("mcp-token-abc".to_string());
        let len = cred.use_once(|s| s.len());
        assert_eq!(len, "mcp-token-abc".len());
    }
}
