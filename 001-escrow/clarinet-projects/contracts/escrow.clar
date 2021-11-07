;; escrow contract, price is negotiated outside of contract and double amount is expected
;; seller sets the price by first sending STX double the price, buyer does the same  

;; constants
(define-constant contract-owner tx-sender)
(define-constant contract (as-contract tx-sender))

(define-constant err-invalid-caller (err u100))
(define-constant err-invalid-amount (err u110))
(define-constant err-invalid-call (err u120))

;; data maps and vars
(define-map orders
    {order-id: uint} 
    {price: uint, deposit: uint, buyer: (optional principal), seller: (optional principal)}
)

;; read-only functions
(define-read-only (get-buyer (id uint))
    (get buyer (unwrap! (map-get? orders {order-id: id}) none))
)

(define-read-only (get-seller (id uint))
    (get seller (unwrap! (map-get? orders {order-id: id}) none))
)

(define-read-only (get-deposit (id uint))
    (get deposit (unwrap! (map-get? orders {order-id: id}) u0))
)

(define-read-only (get-price (id uint))
    (get price (unwrap! (map-get? orders {order-id: id}) u0))
)

(define-read-only (get-order (id uint))
    (map-get? orders {order-id: id})
)

;; public functions
(define-public (seller-deposit (id uint) (amount uint))
    (begin 
        ;; call only once 
        (asserts! (is-none (get-seller id)) err-invalid-call)
        ;; deposit & price > 0
        (asserts! (> (/ amount u2) u0) err-invalid-amount) 
        
        (map-set orders {order-id: id} 
            {price: (/ amount u2), deposit: amount, buyer: none, seller: (some tx-sender)})
        
        (stx-transfer? amount tx-sender contract)
    )
)

(define-public (buyer-deposit (id uint) (amount uint))
    (begin
        ;; no seller
        (asserts! (is-some (get-seller id)) err-invalid-call)
        ;; call only once 
        (asserts! (is-none (get-buyer id)) err-invalid-call)
        ;; verify deposit
        (asserts! (is-eq (get-deposit id) amount) err-invalid-amount)
        
        (map-set orders {order-id: id} 
            (merge (unwrap! (get-order id) err-invalid-call) {buyer: (some tx-sender)}))

        (stx-transfer? amount tx-sender contract)
    )
)

(define-public (item-received (id uint)) 
    (let (
            (buyer (get-buyer id))
            (seller (get-seller id))
            (deposit (get-deposit id))
            (price (get-price id))
        )
        ;; verify buyer 
        (asserts! (is-eq buyer (some tx-sender)) err-invalid-caller)
        ;; transfers
        (try! (as-contract (stx-transfer? 
            (- deposit price) 
            tx-sender (unwrap! buyer err-invalid-call)
        )))
        (try! (as-contract (stx-transfer? 
            (+ deposit price) 
            tx-sender (unwrap! seller err-invalid-call)
        )))
        
        (print (get-order id))
        (map-delete orders {order-id: id})

        (ok true)
    )
)