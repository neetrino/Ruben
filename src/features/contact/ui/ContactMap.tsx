import { STORE_MAP_EMBED_SRC } from "@/lib/store/map-embed";

type ContactMapProps = {
  title: string;
};

/** Below-the-fold map — lazy iframe, no client JS. */
export function ContactMap({ title }: ContactMapProps) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="h-[500px] w-full bg-gray-100">
        <iframe
          title={title}
          src={STORE_MAP_EMBED_SRC}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
