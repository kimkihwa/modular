import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, MenuItem, MenuOption } from '@/types'

export const useCartStore = defineStore('cartStore', () => {
  const items = ref<CartItem[]>([])

  // 총 수량
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 총 금액
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  // 간단한 장바구니 추가 (MenuView용)
  const addItem = (cartItem: { menuId: string; name: string; price: number; quantity: number }) => {
    const existingIndex = items.value.findIndex(item => item.menuId === cartItem.menuId)
    
    if (existingIndex >= 0) {
      items.value[existingIndex].quantity += cartItem.quantity
    } else {
      items.value.push({
        menuId: cartItem.menuId,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        options: [],
        totalPrice: cartItem.price * cartItem.quantity
      })
    }
  }

  // 장바구니에 추가 (옵션 포함)
  const addToCart = (menu: MenuItem, quantity: number, selectedOptions: MenuOption[] = []) => {
    const optionPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    const itemPrice = menu.price + optionPrice
    const totalItemPrice = itemPrice * quantity

    // 동일 메뉴 + 동일 옵션이 있는지 확인
    const existingIndex = items.value.findIndex(item => {
      if (item.menuId !== menu.id) return false
      if (item.options.length !== selectedOptions.length) return false
      return item.options.every((opt, idx) => opt.id === selectedOptions[idx]?.id)
    })

    if (existingIndex >= 0) {
      // 기존 항목에 수량 추가
      items.value[existingIndex].quantity += quantity
      items.value[existingIndex].totalPrice += totalItemPrice
    } else {
      // 새 항목 추가
      items.value.push({
        menuId: menu.id,
        name: menu.name,
        price: itemPrice,
        quantity,
        options: selectedOptions,
        totalPrice: totalItemPrice
      })
    }
  }

  // 수량 변경
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }
    items.value[index].quantity = quantity
    items.value[index].totalPrice = items.value[index].price * quantity
  }

  // 장바구니에서 제거
  const removeFromCart = (index: number) => {
    items.value.splice(index, 1)
  }

  // 장바구니 비우기
  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}, {
  persist: true
})
