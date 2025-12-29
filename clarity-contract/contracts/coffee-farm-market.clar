;; Coffee Farmers Marketplace Contract
;; Contract name: coffee-farm-market
;; Features: Farmers list coffee bags, buyers buy with STX, quantity reduced, earnings tracked

;; Data structures
(define-data-var next-item-id uint u1)
(define-map coffee-items uint { name: (string-ascii 80), price: uint, quantity: uint, seller: principal, active: bool })
(define-map farmer-earnings principal uint) ;; accumulated STX earned

;; Public functions

;; List a new coffee item
;; @param name: name of the coffee bag
;; @param price: price in microSTX per unit
;; @param quantity: quantity available
;; @returns: (ok item-id) or error
(define-public (list-coffee (name (string-ascii 80)) (price uint) (quantity uint))
  (begin
    (asserts! (> (len name) u0) (err u7)) ;; ERR_NAME_EMPTY: name cannot be empty
    (asserts! (> price u0) (err u1)) ;; ERR_PRICE_ZERO: price must be greater than 0
    (asserts! (> quantity u0) (err u2)) ;; ERR_QUANTITY_ZERO: quantity must be greater than 0
    (let ((item-id (var-get next-item-id)))
      (map-set coffee-items item-id { name: name, price: price, quantity: quantity, seller: tx-sender, active: true })
      (var-set next-item-id (+ item-id u1))
      (ok item-id)
    )
  )
)

;; Buy coffee from a listed item
;; @param item-id: the item to buy from
;; @param qty: quantity to buy
;; @returns: (ok true) or error
(define-public (buy-coffee (item-id uint) (qty uint))
  (begin
    (asserts! (> qty u0) (err u3)) ;; ERR_BUY_QTY_ZERO: quantity to buy must be greater than 0
    (let ((item (unwrap! (map-get? coffee-items item-id) (err u4)))) ;; ERR_ITEM_NOT_FOUND: item must exist
      (asserts! (get active item) (err u5)) ;; ERR_ITEM_INACTIVE: item must be active
      (asserts! (>= (get quantity item) qty) (err u6)) ;; ERR_INSUFFICIENT_QUANTITY: sufficient quantity available
      (let ((total-cost (* (get price item) qty))
            (seller (get seller item))
            (new-quantity (- (get quantity item) qty)))
        (try! (stx-transfer? total-cost tx-sender seller))
        (map-set coffee-items item-id (merge item { quantity: new-quantity, active: (> new-quantity u0) }))
        (map-set farmer-earnings seller (+ (default-to u0 (map-get? farmer-earnings seller)) total-cost))
        (ok true)
      )
    )
  )
)

;; Read-only functions

;; Get coffee item details
(define-read-only (get-coffee-item (id uint))
  (map-get? coffee-items id)
)

;; Get next item ID
(define-read-only (get-next-item-id)
  (var-get next-item-id)
)

;; Get farmer earnings
(define-read-only (get-farmer-earnings (farmer principal))
  (default-to u0 (map-get? farmer-earnings farmer))
)