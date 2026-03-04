import { ITimeBlockResponse, TypeTimeBlockFormState } from '@/types/time-block.types';



import { axiosWithAuth } from '@/api/interceptors';





class TimeBlockService {
	private BASE_URL = '/user/time-blocks'

	async getTimeBlocks() {
		return await axiosWithAuth.get<ITimeBlockResponse[]>(this.BASE_URL)
	}

	async createTimeBlock(data: TypeTimeBlockFormState) {

		return await axiosWithAuth.post(this.BASE_URL, data)
	}

	async updateOrderTimeBlock(ids: string[]) {
		return await axiosWithAuth.put(`${this.BASE_URL}/update-order`, { ids })
	}

	async updateTimeBlock(id: string, data: TypeTimeBlockFormState) {
		return await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)
	}

	async deleteTimeBlock(id: string) {
		return await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
	}
}

export const timeBlockService = new TimeBlockService()