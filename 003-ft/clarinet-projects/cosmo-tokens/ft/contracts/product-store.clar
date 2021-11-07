
;; product-store

(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONVERSION_UNIT u1000)
(define-constant ERR_NO_RECORD_FOUND u404)
(define-constant ERR_DUPLICATE_RECORD u504)
(define-constant ERR_UPDATE_RECORD u505)
(define-constant ERR_UNAUTHORIZED_CALLER u400)
(define-constant ERR_INVALID_PRICE u401)
(define-constant ERR_INVALID_TOKEN_AMOUNT u405)
(define-constant ERR_INVALID_QUANTITY u406)
(define-constant SUCCESS u200)


(define-map products { name: (string-ascii 50)} { quantity: uint })
(define-map prices  {name: (string-ascii  50)} { price: uint }) 

(define-read-only (get-product-quantity (name (string-ascii 50)))
   (default-to u0 (get quantity (map-get? products { name: name })))
)

(define-private (decrement-quantity (name (string-ascii 50)))
  (let
    ((required-product (unwrap! (map-get? products { name: name }) (err ERR_NO_RECORD_FOUND))) 
     (quantity (get quantity required-product))
    )
    (asserts! (> quantity u0) (err ERR_INVALID_QUANTITY))
    (map-set products {name: name} {quantity: (- quantity u1)})
    (ok SUCCESS)
  )   
)


(define-public (add-product (name (string-ascii 50)) (price uint) (quantity uint) ) 
  (let 
    ((previous-quantity (get-product-quantity name)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED_CALLER)) 
    (asserts! (> price u0) (err ERR_INVALID_PRICE))
    (asserts! (> quantity u0) (err ERR_INVALID_QUANTITY))
    (map-set products {name: name} {quantity: (+ quantity previous-quantity)})
    (map-set prices {name: name} {price: price})
    (ok SUCCESS)
  )
)


(define-public (delete-product (name (string-ascii 50)))
  (begin 
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED_CALLER)) 
    (ok (map-delete products {name: name}))
  )
)

(define-public (buy-product (name (string-ascii 50)))
   (let 
      ((product-price (try! (get-product-price name))) 
       (tokens (* CONVERSION_UNIT product-price))
      )
      (try! (decrement-quantity name))
      (try! (stx-transfer? product-price tx-sender (as-contract tx-sender)))
      (ok (try! (contract-call? .cosmo-ft issue-token tokens tx-sender)))
   )
)

(define-public (transfer-reward-tokens (amount uint) (recipient principal))
   (begin 
      (ok (try! (contract-call? .cosmo-ft transfer amount tx-sender recipient)))
   )
)

(define-public (redeem-reward-tokens (amount uint))
   (let 
      ((caller tx-sender)
       (transfer-amount (/ amount CONVERSION_UNIT)))
      (asserts! (> amount u0) (err ERR_INVALID_TOKEN_AMOUNT))
      (try! (contract-call? .cosmo-ft destroy-token amount tx-sender))
      (try! (as-contract (stx-transfer? transfer-amount tx-sender caller)))
      (ok SUCCESS)
   )
)

(define-read-only (get-bonus-points-count)
   (contract-call? .cosmo-ft get-balance-of tx-sender)
)

(define-read-only (get-product-price (name (string-ascii 50)))
    (let
       ((required-product (unwrap! (map-get? prices { name: name }) (err ERR_NO_RECORD_FOUND))))
       (ok (get price required-product))
    ) 
)
