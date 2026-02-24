import { IBase } from '@/types/root.types'

export enum EnumTaskPriority {
	low = 'low',
	medium = 'medium',
	high = 'high'
}

export interface ITuskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	isCompleted: boolean
}

export type TypeTaskFormState = Partial<Omit<ITuskResponse, 'id' | 'updatedAt'>>

