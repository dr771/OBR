## MODIFIED Requirements

### Requirement: Line-item images use the PLP default blend treatment
Each cart drawer line-item image SHALL use `mix-blend-mode: multiply` and a 1.6rem border radius on a content-sized local `#f1f5f9` photo-frame backdrop. The media cell itself SHALL receive no blend-specific background, radius, or isolation styling.

#### Scenario: Shopper views a white-background packshot
- **WHEN** a cart drawer line item renders a white-background packshot
- **THEN** the white background visibly blends into its local pale photo frame without creating a full-height tinted media column
