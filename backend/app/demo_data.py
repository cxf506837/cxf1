from __future__ import annotations

from textwrap import dedent


def synthetic_sku_master() -> dict[str, dict[str, str]]:
    return {
        "PEN-MULTI-5": {
            "category": "office gift",
            "factory": "Demo Works",
            "product_name": "Engraved Ballpoint Pen Set",
            "variant_1": "Multiple Color",
            "default_font": "Font 1",
            "default_bag_color": "Grey",
        },
        "KEY-LEATHER-B": {
            "category": "accessory",
            "factory": "Demo Works",
            "product_name": "Leather Keychain B",
            "variant_1": "Pink",
            "default_font": "Font 5",
            "default_bag_color": "Pink",
        },
        "BOX-RING-WOOD": {
            "category": "jewelry box",
            "factory": "North Sample Studio",
            "product_name": "Wood Ring Box",
            "variant_1": "Walnut",
            "variant_2": "Black Line",
            "variant_3": "Two Slots",
            "default_font": "Font 2",
            "default_bag_color": "Grey",
        },
        "MUG-CERAMIC-01": {
            "category": "drinkware",
            "factory": "North Sample Studio",
            "product_name": "Personalized Ceramic Mug",
            "variant_1": "Coffee",
            "default_font": "Font 3",
            "default_bag_color": "Blue",
        },
    }


def build_synthetic_pdf_text() -> str:
    return dedent(
        """
        === Page 1 ===
        Order: ODW-1001
        Ship to:
        Avery Stone
        1810 Sample Drive
        Oxnard, CA 93036
        United States
        Item:
        SKU: PEN-MULTI-5
        Quantity: 5 Pens
        Color: Multiple Color
        Personalization:
        Mira, Font 2
        Blue bag

        === Page 2 ===
        Order: ODW-1002
        Ship to:
        Daddy K??
        42 Harbor Lane
        Austin, TX 73301
        United States
        Item:
        SKU: KEY-LEATHER-B
        Quantity: 1
        Color: Pink
        Personalization:
        Narelle
        Font 5
        Pink bag

        === Page 3 ===
        Order: ODW-1003
        Ship to:
        Rowan Hale
        700 Cedar Street
        Denver, CO 80202
        United States
        Item:
        SKU: BOX-RING-WOOD
        Quantity: 1
        Color: Walnut
        Personalization:
        1) Mr. & Mrs. Kitt, 06.06.26 3) Grey bag

        === Page 4 ===
        Order: ODW-1004
        Ship to:
        Casey Reed
        11 North Avenue
        Seattle, WA 98101
        United States
        Item:
        SKU: MUG-CERAMIC-01
        Quantity: 1
        Color: Coffee
        Personalization:
        Meet you at the bar
        Font 3
        """
    ).strip()

