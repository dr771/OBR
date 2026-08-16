## MODIFIED Requirements

### Requirement: Sidebar width follows compact facet content
The desktop form SHALL use a 23rem content width, a 4.8rem gutter before the product grid, and keep each title on one line by allowing its reset link to wrap beneath it when necessary.

#### Scenario: Long active facet title shares the desktop sidebar
- **WHEN** a long facet title and its reset link cannot fit within the 23rem filter column
- **THEN** the title remains unbroken, the reset link moves to the next row without clipping the facet content, and 4.8rem separates the filter column from the product grid
