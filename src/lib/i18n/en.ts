import type { TranslationKey } from './id';

const en: Record<TranslationKey, string> = {
  // Header
  header_address: 'Address',

  // Search
  search_placeholder: 'Search menu...',

  // Category
  category_all: 'All',

  // Product
  product_add: 'Add',
  product_select: 'Select',
  product_unavailable: 'Unavailable',
  product_stock: 'Stock: {stock}',

  // Variant modal
  variant_title: 'Choose Variant',
  variant_select: 'Select {group}',
  variant_note_label: 'Note (optional)',
  variant_note_placeholder: 'E.g. No onion, spice level 2...',
  variant_required: 'Required',
  variant_add_to_cart: 'Add to Cart',
  variant_update_cart: 'Update Cart',

  // Cart
  cart_empty: 'Your cart is empty',
  cart_empty_desc: 'Add items to start your order',
  cart_title: 'Cart',
  cart_total: 'Total',
  cart_checkout: 'Order Now',
  cart_item_remove: 'Remove',
  cart_note: 'Note: {note}',
  cart_note_add: '+ Add note',
  cart_note_placeholder: 'Note for this item...',

  // Checkout form
  checkout_title: 'Order Details',
  checkout_name_label: 'Name',
  checkout_name_placeholder: 'Enter your name',
  checkout_table_label: 'Table Number',
  checkout_table_placeholder: 'Enter table number',
  checkout_note_label: 'Note (optional)',
  checkout_note_placeholder: 'Additional notes for your order...',
  checkout_submit: 'Confirm Order',
  checkout_name_required: 'Name is required',
  checkout_table_required: 'Table number is required',
  checkout_phone_label: 'Phone Number',
  checkout_phone_placeholder: 'e.g. 08123456789',
  checkout_phone_required: 'Phone number is required',
  checkout_phone_invalid: 'Invalid phone number format',

  // Order result — pending (can_paylater)
  order_pending_title: 'Order Received!',
  order_pending_desc: 'Your order has been submitted and is waiting for cashier approval.',
  order_pending_note: 'Please wait for cashier confirmation.',
  order_new_order: 'Order Again',

  // Order result — QR
  order_qr_title: 'Show this QR to Cashier',
  order_qr_desc: 'The cashier will scan this QR to process your order.',
  order_qr_expires: 'This QR is valid for 30 minutes',

  // Self-pay checkout (F-33)
  selfpay_checkout_title: 'Pay Now',
  selfpay_submit: 'Pay {total} via QRIS',
  selfpay_disclaimer: 'Your order is processed automatically once payment succeeds, no cashier approval needed.',
  selfpay_qris_title: 'Scan to Pay',
  selfpay_qris_desc: 'Use any e-wallet or mobile banking app that supports QRIS.',
  selfpay_waiting: 'Waiting for payment...',
  selfpay_dont_close: "Don't close this page until payment is complete.",
  selfpay_paid_title: 'Payment Successful!',
  selfpay_paid_desc: 'Your order is paid and sent straight to the kitchen/cashier.',
  selfpay_failed_title: 'Payment Failed',
  selfpay_failed_desc: 'The QRIS expired or was cancelled. Please try ordering again.',

  // Search
  search_no_results: 'No items found.',

  // Errors
  error_business_not_found: 'Store not found.',
  error_menu_disabled: 'Digital menu is not available for this store.',
  error_load_menu: 'Failed to load menu. Please refresh the page.',
  error_order_failed: 'Failed to place order. Please try again.',

  // Common
  back: 'Back',
  close: 'Close',
  loading: 'Loading...',
};

export default en;
