import SideNav from '@/app/ui/dashboard/sidenav';
 
import 'primereact/resources/themes/lara-light-blue/theme.css'; // o cualquier otro tema
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}