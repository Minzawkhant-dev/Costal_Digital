"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, MessagesSquare, Phone, X } from "lucide-react";
import { contactChannels, type ContactChannel } from "@/lib/content";
import { Magnetic } from "@/components/motion/Effects";

/**
 * The floating contact dock.
 *
 * A single button, bottom-right, that fans out into whichever contact channels
 * are actually configured. Three decisions worth knowing about:
 *
 * 1. It is present from the first paint, in accent teal rather than ink. It
 *    briefly waited for 240px of scroll so as not to compete with the hero's
 *    own CTA; being missed was the worse outcome, so it now shows immediately
 *    and carries its label at every width rather than shrinking to an icon.
 *
 * 2. It hides itself on /contact and /start-a-project. A button offering to
 *    open a contact form, floating over the contact form, is noise — and on a
 *    phone it covers the submit button it is trying to compete with.
 *
 * 3. It retires itself once the footer is on screen, which already carries a
 *    full-width "Start a Project" CTA — the thing this dock exists to
 *    shortcut to. Two competing calls to action in one viewport is one too
 *    many, and the teal-on-ink pairing was never going to be the good one.
 *
 * Channels come from `contactChannels` in content.ts and unset ones are
 * dropped, so adding LINE later is one line of data and no change here.
 *
 * Layering: z-50 puts it under the header (z-60) and under the mobile nav
 * sheet (z-55), so an open menu is never fighting it for the same pixels.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const CHANNELS_ID = "contact-dock-channels";

/**
 * Routes that already put a contact form in front of the visitor. Matched
 * exactly — /work/… and friends all keep the dock.
 */
const HIDDEN_ON = ["/contact", "/start-a-project"];

/** Set on the footer element in SiteFooter. */
const FOOTER_ID = "site-footer";

/**
 * lucide ships no brand marks, so these are the nearest honest generics rather
 * than an approximation of someone's logo. The label carries the identity.
 */
const icons: Record<ContactChannel["id"], React.ReactNode> = {
  email: <Mail size={15} />,
  line: <MessageCircle size={15} />,
  messenger: <MessagesSquare size={15} />,
  whatsapp: <Phone size={15} />,
  form: <ArrowUpRight size={15} />,
};

export function ContactDock() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // A channel with no href is one that does not exist yet.
  const channels = contactChannels.filter(
    (channel): channel is ContactChannel & { href: string } => Boolean(channel.href),
  );

  const visible = !footerInView && !HIDDEN_ON.includes(pathname);

  /*
   * The footer lives in the layout and survives every navigation, so this
   * observer is set up once. The bottom margin trips it slightly early, so the
   * dock is gone before the ink edge reaches it rather than fading out on top
   * of it. Lenis drives the real window scroll, so IntersectionObserver sees
   * exactly what the visitor does.
   */
  useEffect(() => {
    const footer = document.getElementById(FOOTER_ID);
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { rootMargin: "0px 0px 80px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Close on navigation, and whenever the dock itself goes away — otherwise it
  // would come back mid-fan the next time the visitor scrolls down.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape should leave focus somewhere sensible, not on a node that is
      // about to unmount.
      triggerRef.current?.focus();
    };

    // pointerdown rather than click: it fires before focus moves, so tapping
    // straight from an open dock onto a link elsewhere still follows the link.
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (channels.length === 0) return null;

  /*
   * Reduced motion is handled explicitly rather than left to the library. The
   * global CSS rule in globals.css only reaches CSS transitions, and these are
   * JS-driven — so under reduced motion the dock crossfades in place and the
   * stagger is dropped, instead of flying up from the corner.
   */
  const listVariants: Variants = {
    closed: {
      transition: reduced ? {} : { staggerChildren: 0.035, staggerDirection: -1 },
    },
    open: {
      transition: reduced ? {} : { staggerChildren: 0.045, delayChildren: 0.03 },
    },
  };

  const itemVariants: Variants = reduced
    ? {
        closed: { opacity: 0, transition: { duration: 0.12 } },
        open: { opacity: 1, transition: { duration: 0.12 } },
      }
    : {
        closed: { opacity: 0, y: 10, scale: 0.94, transition: { duration: 0.18 } },
        open: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 430, damping: 32, mass: 0.6 },
        },
      };

  const dockMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: 18, scale: 0.92 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 18, scale: 0.92 },
        transition: { duration: 0.5, delay: 0.25, ease: EASE },
      };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          {...dockMotion}
          /*
           * pointer-events-none on the box, auto on the controls: the padding
           * is generous enough to matter, and without this it would swallow
           * taps aimed at whatever sits underneath the corner.
           */
          className="pointer-events-none fixed bottom-0 right-0 z-50 flex flex-col items-end gap-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7 sm:pb-[max(1.75rem,env(safe-area-inset-bottom))]"
        >
          <AnimatePresence>
            {open && (
              <motion.ul
                id={CHANNELS_ID}
                aria-label="Contact channels"
                initial="closed"
                animate="open"
                exit="closed"
                variants={listVariants}
                /*
                 * col-reverse, so DOM order runs bottom-to-top on screen. The
                 * channel nearest the thumb is the first one Tab reaches and
                 * the first one the stagger plays, instead of the furthest.
                 */
                className="pointer-events-auto flex flex-col-reverse items-end gap-2.5"
              >
                {channels.map((channel) => (
                  <motion.li key={channel.id} variants={itemVariants}>
                    <ChannelLink channel={channel} onNavigate={() => setOpen(false)} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <Magnetic strength={8} className="pointer-events-auto">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={open ? CHANNELS_ID : undefined}
              aria-label={open ? "Close contact options" : "Open contact options"}
              className="group/dock inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-full border border-accent bg-accent px-5 text-[0.875rem] font-medium text-white shadow-[0_14px_38px_-10px_rgba(14,124,134,0.65)] transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-bright hover:bg-accent-bright active:scale-[0.98] sm:h-12"
            >
              <span className="grid size-[18px] shrink-0 place-items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="close"
                      initial={reduced ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { rotate: 0, opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="grid place-items-center"
                    >
                      <X size={18} strokeWidth={2.2} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={reduced ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { rotate: 0, opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="grid place-items-center"
                    >
                      <MessageCircle size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              {/*
                Shown at every width. The label swaps with the state rather
                than sitting next to a cross still reading "Let's talk".
              */}
              <span className="whitespace-nowrap">
                {open ? "Close" : "Let’s talk"}
              </span>
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChannelLink({
  channel,
  onNavigate,
}: {
  channel: ContactChannel & { href: string };
  onNavigate: () => void;
}) {
  const className =
    "group/channel flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 shadow-[0_12px_30px_-16px_rgba(10,20,28,0.6)] transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-ink/25";

  const body = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-paper text-accent transition-colors duration-300 group-hover/channel:border-accent/30 group-hover/channel:bg-accent-soft">
        {icons[channel.id]}
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[0.875rem] font-medium text-ink">{channel.label}</span>
        <span className="text-[0.72rem] text-muted">{channel.detail}</span>
      </span>
    </>
  );

  // Internal routes go through Link so they prefetch and keep client
  // navigation; mailto: and every third-party channel are plain anchors.
  if (channel.href.startsWith("/")) {
    return (
      <Link href={channel.href} className={className} onClick={onNavigate}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={channel.href}
      className={className}
      onClick={onNavigate}
      {...(channel.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {body}
    </a>
  );
}
