;; SIP009 NFT trait on mainnet
;; (impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(impl-trait .nft-trait.nft-trait)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_TOKEN_LIMIT u1000)
(define-constant MAX_FREE_TOKEN_LIMIT u100)
(define-constant TOKEN_PRICE u10000)

;; ERR Constants
(define-constant ERR_TOKEN_OWNER_ONLY (err u101))
(define-constant ERR_MAX_TOKEN_LIMIT_REACHED (err u102))

;; NFT
(define-non-fungible-token velocity uint)

;; Storage
(define-map tokens-count principal uint)
(define-map tokens {owner: principal} {tokens: (list 1000 uint)})
(define-data-var removing-token uint u0)
(define-data-var last-token-id uint u0)

(define-read-only (get-last-token-id) 
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok (some (concat "https://velocity-nft.com/uri/" (contract-call? .string-conversion uint-to-string token-id))))
)

(define-read-only (get-meta (token-id uint))
    (ok (some {name: "Clarity Developer Velocity", uri: "https://bafybeif4p2ukltj5eofwriclz4ru3p7izitprrs7a2rjhtp6qat673wagu.ipfs.dweb.link/", mime-type: "video/webm"}))
)

(define-read-only (get-nft-meta (token-id uint))
    (ok (some {name: "Clarity Developer Velocity", uri: "https://bafybeif4p2ukltj5eofwriclz4ru3p7izitprrs7a2rjhtp6qat673wagu.ipfs.dweb.link/", mime-type: "video/webm"}))
)

(define-read-only (get-owner (token-id uint)) 
    (ok (nft-get-owner? velocity token-id))
)

;; This function returns the list of all tokens owned by an owner
(define-read-only (get-tokens (owner principal))
    (default-to (list) (get tokens (map-get? tokens {owner: owner})))
)

;; to get the nft count for the account
(define-read-only (balance-of (account principal))
    (default-to u0 (map-get? tokens-count account))
)

;; on success, decrements the sender current balance and increments recipient current balance and updates the lists
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_TOKEN_OWNER_ONLY)
        (try! (nft-transfer? velocity token-id sender recipient))
        (decrement-account-token-balance sender)
        (remove-token sender token-id)
        (increment-account-token-balance recipient)
        (add-token recipient token-id)
        (ok true)
    )
)

;; any one can claim tokens
(define-public (claim)
    (if (< (var-get last-token-id) MAX_FREE_TOKEN_LIMIT)
        (mint-for-free tx-sender)
    (mint TOKEN_PRICE tx-sender))
)

(define-private (mint-for-free (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        
        (asserts! (< token-id MAX_TOKEN_LIMIT) ERR_MAX_TOKEN_LIMIT_REACHED)
        (try! (nft-mint? velocity token-id recipient))
        (increment-account-token-balance recipient)
        (add-token recipient token-id)
        (var-set last-token-id token-id)
        (ok token-id)
    )
)

(define-private (mint (amount uint) (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        (asserts! (< token-id MAX_TOKEN_LIMIT) ERR_MAX_TOKEN_LIMIT_REACHED)
        (try! (stx-transfer? amount recipient CONTRACT_OWNER))
        (try! (nft-mint? velocity token-id recipient))
        (increment-account-token-balance recipient)
        (add-token recipient token-id)
        (var-set last-token-id token-id)
        (ok token-id)
    )
)

;; This is just to check if the user can mint any token he wants to
(define-public (custom-claim (token-id uint))
    (custom-mint TOKEN_PRICE tx-sender token-id)
)

(define-private (custom-mint (amount uint) (recipient principal) (token-id uint))
    (begin
        (asserts! (< token-id MAX_TOKEN_LIMIT) ERR_MAX_TOKEN_LIMIT_REACHED)
        (try! (stx-transfer? amount recipient CONTRACT_OWNER))
        (try! (nft-mint? velocity token-id recipient))
        (increment-account-token-balance recipient)
        (add-token recipient token-id)
        (var-set last-token-id token-id)
        (ok token-id)
    )
)

(define-private (increment-account-token-balance (account principal))
    (map-set tokens-count account (+ (balance-of account) u1))
)

(define-private (decrement-account-token-balance (account principal))
    (map-set tokens-count account (- (balance-of account) u1))
)

(define-private (add-token (owner principal) (token-id uint))
    (map-set tokens {owner: owner} {tokens: (unwrap-panic (as-max-len? (append (get-tokens owner) token-id) u1000))})
)

(define-private (remove-token (owner principal) (token-id uint))
    (begin
        (var-set removing-token token-id)
        (map-set tokens {owner: owner} {tokens: (unwrap-panic (as-max-len? (filter remove-token-filter (get-tokens owner)) u1000))})
    )
)

(define-private (remove-token-filter (token-id uint))
    (not (is-eq token-id (var-get removing-token)))
)
