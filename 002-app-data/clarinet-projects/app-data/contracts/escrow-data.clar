;; escrow contract, price is negotiated outside of contract and double amount is expected
;; seller sets the price by first sending STX double the price, buyer does the same  

;; CONTRACT HAS INTENTIONAL BUG in item-received(), fix in app-v2 

(impl-trait .escrow-traits.escrow-traits)

;; constants
(define-constant contract-owner tx-sender)
(define-constant contract (as-contract tx-sender))

(define-constant err-invalid-caller (err u100))
(define-constant err-invalid-amount (err u110))
(define-constant err-invalid-call (err u120))
(define-constant err-unauthorized-caller (err u99))

;; data maps and vars
(define-map orders
    {order-id: uint} 
    {price: uint, deposit: uint, buyer: (optional principal), seller: (optional principal)}
)

;; contract owner can add /remove callers for traits 
(define-map valid-callers { caller: principal } bool)

;; read-only functions
(define-read-only (get-buyer (id uint))
    (default-to none (get buyer (map-get? orders {order-id: id})))
)

(define-read-only (get-seller (id uint))
    (default-to none (get seller (map-get? orders {order-id: id})))
)

(define-read-only (get-deposit (id uint))
    (default-to u0 (get deposit (map-get? orders {order-id: id})))
)

(define-read-only (get-price (id uint))
    (default-to u0 (get price (map-get? orders {order-id: id})))
)

(define-read-only (get-order (id uint))
    (map-get? orders {order-id: id})
)

(define-public (add-caller (caller principal)) 
    (begin
        ;; only contract owner 
        (asserts! (is-eq tx-sender contract-owner) err-invalid-caller) 
        (ok (map-set valid-callers {caller: caller} true))
    )
)

(define-public (remove-caller (caller principal)) 
    (begin 
        ;; only contract owner 
        (asserts! (is-eq tx-sender contract-owner) err-invalid-caller)
        (asserts! (map-delete valid-callers {caller: caller}) err-invalid-call)
        (ok true)
    )
)

(define-read-only (is-valid-caller (caller principal)) 
    (map-get? valid-callers {caller: caller})
)

;; public functions
(define-public (seller-deposit (id uint) (amount uint))
    (begin 
        ;; only valid contract principal
        (asserts! (is-some (is-valid-caller contract-caller)) err-unauthorized-caller)
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
        ;; only valid contract principal
        (asserts! (is-some (is-valid-caller contract-caller)) err-unauthorized-caller)
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

(define-public (item-received (id uint) (caller principal))
    (begin 
        ;; only valid contract principal
        (asserts! (is-some (is-valid-caller contract-caller)) err-unauthorized-caller)
        (let (
                (buyer (get-buyer id))
                (seller (get-seller id))
                (deposit (get-deposit id))
                (price (get-price id))
            )
            ;; verify buyer 
            ;; INTENTIONALLY COMMENTED -- to be fixed in app-v2 
            ;;(asserts! (is-eq buyer (some caller)) err-invalid-caller)
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
)