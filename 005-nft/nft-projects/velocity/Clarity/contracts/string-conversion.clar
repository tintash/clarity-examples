(define-constant LIST_40 (list
  true true true true true true true true true true
  true true true true true true true true true true
  true true true true true true true true true true
  true true true true true true true true true true
))

(define-read-only (uint-to-string (value uint))
  (get return (fold uint-to-string-clojure LIST_40 {value: value, return: ""}))
)

(define-read-only (uint-to-string-clojure (i bool) (data {value: uint, return: (string-ascii 40)}))
  (if (> (get value data) u0)
    {
      value: (/ (get value data) u10),
      return: (unwrap-panic (as-max-len? (concat (unwrap-panic (element-at "0123456789" (mod (get value data) u10))) (get return data)) u40))
    }
    data
  )
)