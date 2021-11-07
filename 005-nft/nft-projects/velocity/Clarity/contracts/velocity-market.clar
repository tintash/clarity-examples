
;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant VELOCITY_MIN_PRICE_STX u10000)
(define-constant COMMISION_RATE_PER_10000_STX u250) ;; 2.5%

;; Errors
(define-constant ERR_VELOCITY_NOT_FOR_SALE (err u200))
(define-constant ERR_VELOCITY_PRICE_MIN_LIMIT (err u201))
(define-constant ERR_UNWRAP_FAILED (err u202))
(define-constant ERR_BUYER_ONLY (err u203))

;; Storage
(define-map velocity-for-sale {token-id: uint} {seller: principal, price: uint})

(define-read-only (get-velocity-for-sale (token-id uint))
    (map-get? velocity-for-sale {token-id: token-id})
)

(define-private (add-velocity-for-sale (token-id uint) (price uint) (seller principal))
    (map-set velocity-for-sale {token-id: token-id} {seller: seller, price: price})
)

(define-private (remove-velocity-for-sale (token-id uint))
    (map-delete velocity-for-sale {token-id: token-id})
)

;; Put velocity token for sale so that people can buy
;; Only token owner can put the velocity token for sale
;; You can see a list of salable velocity tokens in the UI
(define-public (put-velocity-for-sale (token-id uint) (price uint))
    (begin
        ;; price should be greater than 10000
        (asserts! (>= price VELOCITY_MIN_PRICE_STX) ERR_VELOCITY_PRICE_MIN_LIMIT)
        ;; transfer velocity to contract owner
        (try! (contract-call? .velocity transfer token-id tx-sender (as-contract tx-sender)))
        ;; add into velocity-for-sale
        (add-velocity-for-sale token-id price tx-sender)
        ;; return true
        (ok true)
    )
)

;; You can buy velocity tokens for STX
(define-public (buy-velocity (token-id uint))
    (begin
        ;; check if the token-id is present for sale in velocity-for-sale
        (asserts! (is-some (get-velocity-for-sale token-id)) ERR_VELOCITY_NOT_FOR_SALE)
        (let
            (
                (buyer tx-sender)
                (token-seller (unwrap! (get seller (get-velocity-for-sale token-id)) ERR_UNWRAP_FAILED))
                (token-price (unwrap! (get price (get-velocity-for-sale token-id)) ERR_UNWRAP_FAILED))
                ;; cut out commission from the price
                (commission (* (/ token-price u10000) COMMISION_RATE_PER_10000_STX))
                (price-after-commission (- token-price commission))
            )
            ;; transfer remaining stx from buyer to token-seller
            (try! (stx-transfer? price-after-commission buyer token-seller))
            ;; transfer commission stx from buyer to contract-owner account
            (try! (stx-transfer? commission buyer CONTRACT_OWNER))
            ;; transfer the token-id from contract-owner to buyer
            (try! (as-contract (contract-call? .velocity transfer token-id tx-sender buyer)))
            ;; remove token-id from velocity-for-sale
            (remove-velocity-for-sale token-id)
            ;; return true
            (ok true)
        )
    )
)