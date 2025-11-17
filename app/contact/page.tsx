import { redirect } from 'next/navigation';

// Redirect /contact to /iletisim for Turkish language consistency
export default function ContactRedirect() {
  redirect('/iletisim');
}

