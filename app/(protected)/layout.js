import Guarded from "@/components/Guarded";
import TopNav from "@/components/TopNav";

export default async function ProtectedLayout({ children }) {
  return (
    <Guarded>
      <TopNav />
      <div className="container" style={{paddingTop:16}}>
        {children}
      </div>
    </Guarded>
  );
}
