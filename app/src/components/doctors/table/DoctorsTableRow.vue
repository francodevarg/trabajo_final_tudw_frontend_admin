<script setup lang="ts">
import type { DoctorDTO } from '@/types'
import { Pencil, Trash2, Send, Eye } from 'lucide-vue-next'

import DoctorAvatar from '../DoctorAvatar.vue'
import InsuranceBadge from '../InsuranceBadge.vue'
import AvailabilitySummary from '../AvailabilitySummary.vue'

defineProps<{
    item: DoctorDTO
}>()

const emit = defineEmits<{
    (e: 'view', item: DoctorDTO): void
    (e: 'edit', item: DoctorDTO): void
    (e: 'delete', item: DoctorDTO): void
    (e: 'sendWelcomeEmail', item: DoctorDTO): void
}>()

function extractSpecialtyName(s: unknown): string {
    if (!s) return '—'
    if (typeof s === 'string') return s

    if (typeof s === 'object' && s !== null && 'name' in s) {
        return (s as { name: string }).name
    }

    return '—'
}

function extractInsuranceNames(arr: unknown): string[] {
    if (!Array.isArray(arr)) return []

    return arr
        .map(i => {
            if (typeof i === 'string') return i

            if (typeof i === 'object' && i !== null && 'name' in i) {
                return (i as { name: string }).name
            }

            return ''
        })
        .filter(Boolean)
}
</script>

<template>
    <tr class="hover:bg-slate-50/60 transition-colors">
        <!-- Médico -->
        <td class="px-4 py-3">
            <div class="flex items-center gap-3">
                <DoctorAvatar :first-name="item.first_name" :last-name="item.last_name" />

                <div class="min-w-0">
                    <p class="font-medium text-slate-800 text-sm truncate">
                        {{ item.first_name }} {{ item.last_name }}

                        <code v-if="item.license_number"
                            class="ml-1 text-[11px] text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5">
              {{ item.license_number }}
            </code>
                    </p>

                    <p class="text-sm text-slate-400 truncate">
                        {{ item.email }}
                    </p>
                </div>
            </div>
        </td>

        <!-- Especialidad -->
        <td class="px-4 py-3 hidden md:table-cell">
            <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700">
                {{ extractSpecialtyName(item.specialty) }}
            </span>
        </td>

        <!-- Teléfono -->
        <td class="px-4 py-3 hidden lg:table-cell">
            <span class="text-xs text-slate-600">
                {{ item.phone || '—' }}
            </span>
        </td>

        <!-- Honorario -->
        <td class="px-4 py-3 text-right hidden lg:table-cell">
            <span class="text-xs font-medium text-slate-700">
                {{ `$ ${item.consultation_fee || '—'}` }}
            </span>
        </td>

        <!-- Obras sociales -->
        <td class="px-4 py-3 hidden xl:table-cell">
            <InsuranceBadge :names="extractInsuranceNames(item.insurances)" />
        </td>

        <!-- Disponibilidad -->
        <td class="px-4 py-3 hidden 2xl:table-cell">
            <AvailabilitySummary :availabilities="item.availabilities" />
        </td>

        <!-- Acciones -->
        <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-1">
                <button
                    class="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Ver detalle" @click="emit('view', item)">
                    <Eye class="w-4 h-4" />
                </button>

                <button v-permission="'doctor.change_doctor'"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Editar" @click="emit('edit', item)">
                    <Pencil class="w-4 h-4" />
                </button>

                <button v-permission="'doctor.change_doctor'"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Enviar email de bienvenida" :disabled="item.email_status === 'sent'"
                    @click="emit('sendWelcomeEmail', item)">
                    <Send class="w-4 h-4" />
                </button>

                <button v-permission="'doctor.delete_doctor'"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar" @click="emit('delete', item)">
                    <Trash2 class="w-4 h-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
