 import Link from 'next/link';
 
 export default function SecondaryButton({ href, children, onClick, type = 'button', disabled }: { href?: string; children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
   if (href) return <Link className="btn btn-secondary" href={href as any}>{children}</Link>;
   return <button className="btn btn-secondary" onClick={onClick} type={type} disabled={disabled}>{children}</button>;
 }
