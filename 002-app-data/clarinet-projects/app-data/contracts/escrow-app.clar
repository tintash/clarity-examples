
;; escrow-app
(use-trait escrow-traits .escrow-traits.escrow-traits)

(define-constant err-invalid-caller (err u100))

;; public functions
(define-public (seller-deposit (order-id uint) (amount uint))
    (contract-call? .escrow-data seller-deposit order-id amount)
)

(define-public (buyer-deposit (order-id uint) (amount uint))
    (contract-call? .escrow-data buyer-deposit order-id amount)
)

(define-public (item-received (escrow-data <escrow-traits>) (order-id uint) (caller principal))
    (begin 
        ;; caller is sender
        (asserts! (is-eq tx-sender caller) err-invalid-caller)
        (ok (try! (contract-call? escrow-data item-received order-id caller)))
    )
)
