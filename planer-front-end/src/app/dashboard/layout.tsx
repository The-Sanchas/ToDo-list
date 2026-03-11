import { PropsWithChildren } from 'react'
import DashboardLayout from '@/components/dashboatd-layout/DashboardLayout'


export default function Layout({children}: PropsWithChildren<unknown>) {
	return <DashboardLayout>{children}</DashboardLayout>
}