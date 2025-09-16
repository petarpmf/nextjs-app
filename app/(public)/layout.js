import "@/app/globals.css";

export default function PublicLayout({ children }) {
  return <div className="container" style={{paddingTop: 40}}>{children}</div>;
}
