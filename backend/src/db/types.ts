import type {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";


// ─── Database ───────────────────────────────────────────
export interface Database {
    users: UserTable;
    categories: CategoryTable;
    products: ProductTable;
    product_images: ProductImageTable;
    carts: CartTable;
    cart_items: CartItemTable;
    wishlists: WishlistTable;
    wishlist_items: WishlistItemTable;
    orders: OrderTable;
    order_items: OrderItemTable;
    shipping_addresses: ShippingAddressTable;
    user_addresses: UserAddressTable;
    recently_viewed: RecentlyViewedTable;
}


// ─── Users ──────────────────────────────────────────────
export interface UserTable {
    id: Generated<string>;
    name: string;
    email: string;
    password_hash: string;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

// ─── Categories ─────────────────────────────────────────
export interface CategoryTable {
    id: Generated<string>;
    name: string;
    slug: string;
    image_url: string;
}

export type Category = Selectable<CategoryTable>;
export type NewCategory = Insertable<CategoryTable>;
export type CategoryUpdate = Updateable<CategoryTable>;

// ─── Products ───────────────────────────────────────────
export interface ProductTable {
    id: Generated<string>;
    name: string;
    description: string;
    specifications: string | null;
    price: number;
    mrp: number;
    stock: Generated<number>;
    category_id: string;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type Product = Selectable<ProductTable>;
export type NewProduct = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

// ─── Product Images ─────────────────────────────────────
export interface ProductImageTable {
    id: Generated<string>;
    product_id: string;
    url: string;
    display_order: Generated<number>;
    is_primary: Generated<boolean>;
}

export type ProductImage = Selectable<ProductImageTable>;
export type NewProductImage = Insertable<ProductImageTable>;
export type ProductImageUpdate = Updateable<ProductImageTable>;

// ─── Cart ───────────────────────────────────────────────
export interface CartTable {
    id: Generated<string>;
    user_id: string;
    updated_at: ColumnType<Date, string | undefined, string | undefined>;
}

export type Cart = Selectable<CartTable>;
export type NewCart = Insertable<CartTable>;
export type CartUpdate = Updateable<CartTable>;

export interface CartItemTable {
    id: Generated<string>;
    cart_id: string;
    product_id: string;
    quantity: Generated<number>;
}

export type CartItem = Selectable<CartItemTable>;
export type NewCartItem = Insertable<CartItemTable>;
export type CartItemUpdate = Updateable<CartItemTable>;

// ─── Wishlist ───────────────────────────────────────────
export interface WishlistTable {
    id: Generated<string>;
    user_id: string;
}

export type Wishlist = Selectable<WishlistTable>;
export type NewWishlist = Insertable<WishlistTable>;

export interface WishlistItemTable {
    id: Generated<string>;
    wishlist_id: string;
    product_id: string;
    added_at: ColumnType<Date, string | undefined, never>;
}

export type WishlistItem = Selectable<WishlistItemTable>;
export type NewWishlistItem = Insertable<WishlistItemTable>;

// ─── Orders ─────────────────────────────────────────────
export interface OrderTable {
    id: Generated<string>;
    user_id: string;
    status: Generated<"PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED">;
    total_amount: number;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type Order = Selectable<OrderTable>;
export type NewOrder = Insertable<OrderTable>;
export type OrderUpdate = Updateable<OrderTable>;

export interface OrderItemTable {
    id: Generated<string>;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product_name_snapshot: string;
}

export type OrderItem = Selectable<OrderItemTable>;
export type NewOrderItem = Insertable<OrderItemTable>;

// ─── Shipping Addresses ─────────────────────────────────
export interface ShippingAddressTable {
    id: Generated<string>;
    order_id: string;
    full_name: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
}

export type ShippingAddress = Selectable<ShippingAddressTable>;
export type NewShippingAddress = Insertable<ShippingAddressTable>;

// ─── User Addresses ─────────────────────────────────────
export interface UserAddressTable {
    id: Generated<string>;
    user_id: string;
    full_name: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    is_default: Generated<boolean>;
}

export type UserAddress = Selectable<UserAddressTable>;
export type NewUserAddress = Insertable<UserAddressTable>;
export type UserAddressUpdate = Updateable<UserAddressTable>;

// ─── Recently Viewed ────────────────────────────────────
export interface RecentlyViewedTable {
    id: Generated<string>;
    user_id: string;
    product_id: string;
    viewed_at: ColumnType<Date, string | undefined, string | undefined>;
}

export type RecentlyViewed = Selectable<RecentlyViewedTable>;
export type NewRecentlyViewed = Insertable<RecentlyViewedTable>;
export type RecentlyViewedUpdate = Updateable<RecentlyViewedTable>;
