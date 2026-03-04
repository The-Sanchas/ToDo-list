import { NextRequest, NextResponse } from 'next/server';
import { DASHBOARD_PAGES } from '@/config/pages-url.config';
import { EnumTokens } from '@/services/auth-token.service';



export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
	console.log(refreshToken)

	const IsAuthPage = url.includes('/auth')

	if( IsAuthPage && refreshToken ) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))
	}

	if(IsAuthPage) {
		return NextResponse.next()
	}

	if(!refreshToken){
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/auth/:path*']
}