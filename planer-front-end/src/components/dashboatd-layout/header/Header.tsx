import { GlobalLoader } from '@/components/dashboatd-layout/header/GlobalLoader'
import { Profile } from '@/components/dashboatd-layout/header/profile/Profile'


export function Header() {
	return <header>
		<GlobalLoader/>
		<Profile/>
	</header>
}