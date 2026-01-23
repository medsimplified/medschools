import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import EventDetailsArea from "./EventDetailsArea"

const EventDetails = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Resolving Conflicts Between Designers" sub_title="Events" sub_title_2="Resolving Conflicts Between Designers" style={true} />
            <EventDetailsArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default EventDetails

