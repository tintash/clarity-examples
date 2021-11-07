;; cosmo-nft

(impl-trait 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.ft-trait.ft-trait)

(define-fungible-token cosmo-ft)
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED_CALLER u400)
(define-constant ERR_DUPLICATE_RECORD u504)
(define-constant ERR_CONTRACT_PAUSED u505)
(define-constant SUCCESS u200)

(define-data-var is-paused bool false)
(define-map valid-contract-callers { contract-identifier: principal} {valid-caller: bool})

(define-private (is-valid-contract-caller (caller principal))
  (is-some (map-get? valid-contract-callers { contract-identifier: caller }))
)


(define-read-only (get-name) 
  (ok "Cosmo Token")
)

(define-read-only (get-symbol) 
  (ok "CTX")
)

(define-read-only (get-decimals)
  (ok u4)
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply cosmo-ft))
)

(define-read-only (get-token-uri)
  (ok  (some u"\u{1F30C}"))  
)

(define-read-only (get-balance-of (owner-identifier principal))
  (ok (ft-get-balance cosmo-ft owner-identifier))
)

(define-read-only (check-is-contract-paused) 
  (var-get is-paused) 
)

(define-public (transfer ( amount uint) (sender principal) (recipient principal))
  (begin 
    (asserts! (not (check-is-contract-paused)) (err ERR_CONTRACT_PAUSED)) 
    (asserts! (is-eq tx-sender sender) (err ERR_UNAUTHORIZED_CALLER))
    (ft-transfer? cosmo-ft amount sender recipient)
  )
)

(define-public (issue-token ( amount uint) (recipient principal))
   (begin 
      (asserts! (not (check-is-contract-paused)) (err ERR_CONTRACT_PAUSED)) 
      (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-valid-contract-caller contract-caller)) (err ERR_UNAUTHORIZED_CALLER)) 
      (ft-mint? cosmo-ft amount recipient)
   )
)

(define-public (destroy-token (amount uint) (owner principal))
   (begin 
      (asserts! (not (check-is-contract-paused)) (err ERR_CONTRACT_PAUSED)) 
      (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-eq tx-sender owner)) (err ERR_UNAUTHORIZED_CALLER)) 
      (ft-burn? cosmo-ft amount owner)
   )
)

(define-public (add-valid-contract-caller (app-contract-identifier principal))
  (begin 
    (asserts! (not (check-is-contract-paused)) (err ERR_CONTRACT_PAUSED)) 
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED_CALLER)) 
    (ok (map-set valid-contract-callers { contract-identifier: app-contract-identifier } {valid-caller: true }))    
  )
)

(define-public (pause-contract)
  (begin 
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED_CALLER)) 
    (ok (var-set is-paused true))    
  )
)

(define-public (resume-contract)
  (begin 
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED_CALLER)) 
    (ok (var-set is-paused false))    
  )
)