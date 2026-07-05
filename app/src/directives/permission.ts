import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionsStore } from '@/stores/permissions.store'
import type { PermissionValue } from '@/types'

function updateElement(el: HTMLElement, value: PermissionValue) {
  const store = usePermissionsStore()
  const allowed = store.check(value)

  if (!allowed) {
    el.parentNode?.removeChild(el)
  }
}

export const vPermission: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding: DirectiveBinding<PermissionValue>) {
    updateElement(el, binding.value)
  },
  updated(el, binding: DirectiveBinding<PermissionValue>) {
    updateElement(el, binding.value)
  },
}
