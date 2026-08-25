## MODIFIED Requirements

### Requirement: Gallery navigation lives in a counter row beneath the thumbnails
A row beneath the thumbnails SHALL carry the localized image counter at its start and both rail navigation chevrons at its end. The chevrons SHALL retain the scrolling behaviour they have on the thumbnail rail and SHALL NOT be rendered flanking the rail. The chevrons SHALL be hidden whenever the thumbnail rail has no scrollable overflow in either direction — i.e. every thumbnail is already visible and there is nothing to reach by advancing or reversing the rail — regardless of how many thumbnails that is; the counter SHALL still render. This is a generalization of the single-image case: with one thumbnail there is nothing to overflow, and with exactly as many thumbnails as the rail displays at the current breakpoint (e.g. 4 on desktop's 4-up layout, 3 on mobile) there is also nothing to overflow, even though the counter still has something to count.

#### Scenario: Product has more media than the rail shows at once

- **WHEN** a shopper activates the next chevron
- **THEN** the thumbnail rail advances, and no chevron appears to either side of the rail

#### Scenario: Counter reflects the selected media

- **WHEN** the selected media changes by any means
- **THEN** the counter row names the selected image's position within the media actually included for the selected colour

#### Scenario: Product has a single image

- **WHEN** a product's selected colour resolves to one image
- **THEN** the thumbnail grid and the counter row's chevrons are not rendered

#### Scenario: Thumbnails fit the rail without overflowing

- **WHEN** a product's selected colour resolves to more than one image, but all of that colour's thumbnails already fit within the visible rail at the current viewport, so there is nothing to scroll to in either direction
- **THEN** the counter row still renders with its count, but neither chevron is rendered

#### Scenario: Thumbnails overflow at one breakpoint but not another

- **WHEN** the same product's thumbnail count fits the rail fully at one breakpoint (e.g. desktop's 4-up layout) but overflows it at another (e.g. mobile's 3-up layout)
- **THEN** the chevrons are hidden at the breakpoint where nothing overflows and shown at the breakpoint where the rail can still scroll
