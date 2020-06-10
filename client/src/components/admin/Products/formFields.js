export const productFields = [
  { label: 'Name', name: 'name', noValueError: 'You must provide an address' },
  { label: 'Path Name', name: 'path_name', display: false, typeOfComponent: 'field-disable', noValueError: 'You must provide an address' },
  { label: 'Description', name: 'description', noValueError: 'You must provide an address' },
  { label: 'Inventory Count', name: 'inventory_count', noValueError: 'You must provide an address' },
  { label: 'Price', name: 'price', noValueError: 'You must provide an address' },
  { label: 'Height', name: 'height', noValueError: 'You must provide an address' },
  { label: 'Width', name: 'width', noValueError: 'You must provide an address' },
  { label: 'Depth', name: 'depth', noValueError: 'You must provide an address' },
  { label: 'Categories', name: 'categories', typeOfComponent: 'tree', options: {}, noValueError: 'You must provide an address' },
  { label: 'Display To Customer', name: 'display', typeOfComponent: 'check-box', noValueError: 'You must provide an address' },
]

export const productSearchField = [
  { label: 'Search For Product By Name', name: 'search_bar', noValueError: 'You must provide an address' },
]