;; traits for escrow contract 
(define-trait escrow-traits (
        (seller-deposit (uint uint) (response bool uint))
        (buyer-deposit (uint uint) (response bool uint))
        (item-received (uint principal) (response bool uint))
    )
)