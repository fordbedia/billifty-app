import { Button, Link } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { path } from "@/constants/routerPaths";

export default function StreamlineBanner() {
    return (
         <div className="max-w-7xl w-full text-center streamline-banner">
            <div className="streamline-panel">
                <p className="eyebrow">Ready to Move Faster</p>
                <h2>Bring the same level of design control to billing that you already expect from the rest of your business.</h2>
                <p>
                    Start with a cleaner workspace, choose a stronger template direction, and send invoices that feel
                    deliberate instead of assembled at the last minute.
                </p>

                <div className="streamline-actions">
                    <Button as={Link} href={path.auth} className="main-button button-size" disableRipple size="lg">
                        Start Designing Invoices
                        <ArrowRight size={16} strokeWidth={2.2} />
                    </Button>
                </div>
            </div>
         </div>
    )
}
