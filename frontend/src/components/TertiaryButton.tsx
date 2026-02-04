 import Link from 'next/link';
 
 export default function TertiaryButton({ href, children, onClick, type = 'button', disabled }: { href?: string; children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
   if (href) return <Link className="btn btn-tertiary" href={href as any}>{children}</Link>;
   return <button className="btn btn-tertiary" onClick={onClick} type={type} disabled={disabled}>{children}</button>;
 }
