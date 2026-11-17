## ADDED Requirements

### Requirement: Wishlist colour controls offer only colors that can be bought
When an entry's product has at least one available variant, the favorites-page colour chips and the cart cross-sell colour dropdown SHALL omit every colour that has no available variant in any size, except the entry's own colour, which SHALL stay selected. When fewer than two colours remain, no colour control SHALL render. A product with no available variant SHALL keep every colour.

#### Scenario: Saved colour is still buyable, another is not
- **WHEN** an entry is saved in Black and the product's Lime colour has no available variant
- **THEN** the favorites card and the cross-sell dropdown offer no Lime

#### Scenario: Saved colour sold out since
- **WHEN** an entry is saved in Lime and Lime has since sold out in every size
- **THEN** Lime stays selected and visible, alongside the colours that can still be bought
