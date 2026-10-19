import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FOOTER_EVENTS } from '@myetherwallet/vue-common-components'
import type {
  FooterLink,
  FooterLinkGroup,
  FooterSocial,
} from '@myetherwallet/vue-common-components'
import configs from '@/configs'

const MEW_SITE = 'https://www.myetherwallet.com/'
const RELEASES_URL =
  'https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/'

/**
 * Content for the library AppFooter (MEW-2443): the same destinations,
 * new-tab behaviour and Amplitude events as the 1.x MewFooter it replaces,
 * with copy from the app's `footer` locale.
 */
export const useFooterProps = () => {
  const { t } = useI18n()

  return computed(() => {
    const linkGroups: FooterLinkGroup[] = [
      {
        ariaLabel: t('footer.nav_company'),
        links: [
          {
            label: t('footer.about_us'),
            href: `${MEW_SITE}about`,
            event: FOOTER_EVENTS.aboutUs,
          },
          {
            label: t('footer.team'),
            href: `${MEW_SITE}team`,
            event: FOOTER_EVENTS.team,
          },
          {
            label: t('footer.privacy'),
            href: `${MEW_SITE}privacy-policy`,
            event: FOOTER_EVENTS.privacy,
          },
          {
            label: t('footer.terms'),
            href: `${MEW_SITE}terms-of-service`,
            event: FOOTER_EVENTS.terms,
          },
          {
            label: t('footer.security_policy'),
            href: `${MEW_SITE}security-policy`,
            event: FOOTER_EVENTS.securityPolicy,
          },
          {
            label: t('footer.bug_bounty'),
            href: 'https://hackenproof.com/programs/myetherwallet',
            external: true,
            event: FOOTER_EVENTS.bugBounty,
          },
        ],
      },
      {
        ariaLabel: t('footer.nav_products'),
        links: [
          {
            label: t('footer.mobile_app'),
            href: 'https://www.mewwallet.com/',
            external: true,
            event: FOOTER_EVENTS.mobile,
          },
          {
            label: t('footer.enkrypt'),
            href: 'https://www.enkrypt.com/',
            external: true,
            event: FOOTER_EVENTS.enkrypt,
          },
          {
            label: t('footer.ethvm'),
            href: 'https://www.ethvm.com/',
            external: true,
            event: FOOTER_EVENTS.ethvm,
          },
        ],
      },
      {
        ariaLabel: t('footer.nav_support'),
        links: [
          {
            label: t('footer.help_center'),
            href: 'https://help.myetherwallet.com/en/',
            external: true,
            event: FOOTER_EVENTS.helpCenter,
          },
          {
            label: t('footer.customer_support'),
            href: 'mailto:support@myetherwallet.com',
            external: true,
            event: FOOTER_EVENTS.customerSupport,
          },
          {
            label: t('footer.faq'),
            href: `${MEW_SITE}faq`,
            event: FOOTER_EVENTS.faq,
          },
          {
            label: t('footer.blog'),
            href: `${MEW_SITE}blog/`,
            external: true,
            event: FOOTER_EVENTS.blog,
          },
          {
            label: t('footer.press_kit'),
            href: `${MEW_SITE}presskit`,
            event: FOOTER_EVENTS.pressKit,
          },
        ],
      },
    ]

    const donations: FooterLink[] = [
      {
        label: t('footer.donate_ethereum'),
        href: 'https://www.ethvm.com/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
        event: FOOTER_EVENTS.ethDonation,
      },
      {
        label: t('footer.donate_bitcoin'),
        href: 'https://www.blockchain.com/explorer/addresses/btc/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9',
        event: FOOTER_EVENTS.btcDonation,
      },
    ]

    const socials: FooterSocial[] = (
      [
        ['twitter', 'MEW Twitter', 'https://twitter.com/myetherwallet/'],
        [
          'instagram',
          'MEW Instagram',
          'https://www.instagram.com/myetherwallet/',
        ],
        [
          'linkedin',
          'MEW LinkedIn',
          'https://www.linkedin.com/company/myetherwallet/',
        ],
        ['github', 'MEW GitHub', 'https://github.com/myetherwallet'],
        ['reddit', 'MEW Reddit', 'https://www.reddit.com/r/MyEtherWallet/'],
        ['youtube', 'MEW YouTube', 'https://www.youtube.com/@MyEtherWallet'],
        ['telegram', 'MEW Telegram', 'https://t.me/myetherwallet'],
      ] as const
    ).map(([name, label, href]) => ({
      name,
      label,
      href,
      event: FOOTER_EVENTS.joinCommunity,
      eventItem: name,
    }))

    const version = `v${configs.APP_VERSION}`

    return {
      linkGroups,
      donationText: t('footer.donate_text'),
      donations,
      communityTitle: t('footer.join_community'),
      socials,
      copyright: t('footer.copyright', { year: new Date().getFullYear() }),
      pricingText: t('footer.pricing_from'),
      pricingSource: {
        label: 'CoinGecko',
        href: 'https://www.coingecko.com/',
        external: true,
        event: FOOTER_EVENTS.coinGecko,
      },
      version,
      releaseUrl: `${RELEASES_URL}${version}`,
      versionLabel: t('footer.version_label'),
    }
  })
}
