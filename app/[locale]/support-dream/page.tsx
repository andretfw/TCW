'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocale} from 'next-intl';
import {
  Bitcoin,
  CheckCircle2,
  Copy,
  Heart,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import {
  ACTIVE_DREAM_CAMPAIGNS,
  type ActiveDreamCampaign,
  type CampaignId,
} from '@/lib/campaigns';
import {localizedPath} from '@/lib/routes';

type CryptoAsset = 'btc' | 'eth' | 'usdc';
type Destination = 'kraken' | 'metamask';
type CampaignKey = keyof typeof ACTIVE_DREAM_CAMPAIGNS;
type Locale = 'en' | 'ro' | 'es';

const PAYPAL_BUTTON_ID = '6JXEDTNATW3PS';

const CRYPTO_ADDRESSES = {
  btc: '3BuBreK55MS2fF9MfzMTXL4cG6GQDot3aD',
  ethKraken: '0x54b9694cebc596d8c712ab225347343e2a7bd7e6',
  ethMetamask: '0x66e4cFE637e73A4C5F34fdf6539c849c3366a0AB',
} as const;

const CAMPAIGN_ENTRIES = Object.entries(ACTIVE_DREAM_CAMPAIGNS) as Array<
  [CampaignKey, ActiveDreamCampaign]
>;

const INITIAL_RAISED = Object.fromEntries(
  CAMPAIGN_ENTRIES.map(([, campaign]) => [campaign.id, 0]),
) as Record<CampaignId, number>;

const copy = {
  en: {
    pageTitle: 'Support a Dream',
    pageSubtitle:
      'Help fund meaningful moments for cancer warriors whose dreams are still waiting to be fulfilled.',
    goal: 'Goal',
    raised: 'raised',
    of: 'of',
    paypal: 'PayPal',
    crypto: 'Crypto',
    attribution: 'Every verified donation is assigned to this specific dream.',
    cryptoTitle: 'Donate crypto to this dream',
    cryptoHelp:
      'Send to the TCW wallet, then paste the transaction hash. The site verifies it and adds it to this dream automatically.',
    asset: 'Asset',
    destination: 'Destination',
    kraken: 'Kraken',
    metamask: 'MetaMask',
    address: 'TCW address',
    txHash: 'Transaction hash',
    verify: 'Verify donation',
    verifying: 'Verifying…',
    verified: 'Donation verified and added to the progress bar.',
    copyAddress: 'Copy address',
    close: 'Close',
    campaigns: {
      peacefulWeekend: {
        title: 'Fund a Weekend of Peace for a Grandmother Facing Cancer',
        description:
          'After almost 40 years of work and caring for her family, a routine check in March 2026 changed her life with a cancer diagnosis. She dreams of one peaceful weekend away with her husband—to rest, breathe and make a memory beyond cancer.',
        privacy: 'Her name and image are being kept private for now.',
        image:
          'https://images.unsplash.com/photo-1771923892298-268417b66dc2?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Older couple walking together on a beach, seen from behind',
      },
      memoriesWithGrandchildren: {
        title: 'Help a Grandmother Make Memories With Her Twin Grandchildren',
        description:
          'Living with stage IV gastric cancer, she is an active grandmother who loves travelling, cooking and being close to family. A few days away with her teenage twin grandchildren would offer a breath beyond hospitals, tests and appointments—and create memories they can carry with them.',
        privacy: 'Her name and image are not published on this campaign.',
        image:
          'https://images.unsplash.com/photo-1606474226448-4aa808468efc?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Grandmother and grandchildren walking together through a forest',
      },
      everydayComfort: {
        title: 'Help Make Everyday Life Gentler During Breast Cancer',
        description:
          'Breast cancer and increasing pain have made travel and ordinary tasks difficult. Her wish includes an air fryer, books, potted plants, a soft blanket and other practical comforts that can make her days a little lighter at home.',
        privacy: 'At her request, her name, image and full story remain private.',
        image:
          'https://images.unsplash.com/photo-1713553680479-5b5949ca780f?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Woman reading beside flowers and houseplants with her face hidden',
      },
    },
  },
  ro: {
    pageTitle: 'Susține un vis',
    pageSubtitle:
      'Ajută-ne să transformăm în realitate momente importante pentru warriorii ale căror vise încă așteaptă să fie împlinite.',
    goal: 'Obiectiv',
    raised: 'strânși',
    of: 'din',
    paypal: 'PayPal',
    crypto: 'Crypto',
    attribution: 'Fiecare donație verificată este atribuită acestui vis.',
    cryptoTitle: 'Donează crypto pentru acest vis',
    cryptoHelp:
      'Trimite către walletul TCW, apoi introdu hash-ul tranzacției. Site-ul îl verifică și adaugă automat donația la acest vis.',
    asset: 'Monedă',
    destination: 'Destinație',
    kraken: 'Kraken',
    metamask: 'MetaMask',
    address: 'Adresa TCW',
    txHash: 'Hash-ul tranzacției',
    verify: 'Verifică donația',
    verifying: 'Se verifică…',
    verified: 'Donația a fost verificată și adăugată în bara de progres.',
    copyAddress: 'Copiază adresa',
    close: 'Închide',
    campaigns: {
      peacefulWeekend: {
        title: 'Oferă un weekend de liniște unei bunici care înfruntă cancerul',
        description:
          'După aproape 40 de ani de muncă și grijă pentru familie, un control de rutină din martie 2026 i-a schimbat viața printr-un diagnostic oncologic. Își dorește un weekend liniștit alături de soțul ei—să se odihnească, să respire și să creeze o amintire dincolo de cancer.',
        privacy: 'Numele și imaginea ei sunt păstrate confidențiale pentru moment.',
        image:
          'https://images.unsplash.com/photo-1771923892298-268417b66dc2?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Cuplu în vârstă mergând împreună pe plajă, văzut din spate',
      },
      memoriesWithGrandchildren: {
        title: 'Ajută o bunică să creeze amintiri cu nepoții ei gemeni',
        description:
          'Trăiește cu neoplasm gastric în stadiul IV, dar rămâne o bunică activă, sociabilă, care iubește călătoriile, gătitul și timpul petrecut cu familia. Câteva zile alături de nepoții ei gemeni adolescenți le-ar oferi o pauză de la spitale, analize și programări—și amintiri care să rămână.',
        privacy: 'Numele și imaginea ei nu sunt publicate în această campanie.',
        image:
          'https://images.unsplash.com/photo-1606474226448-4aa808468efc?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Bunică și nepoți mergând împreună prin pădure',
      },
      everydayComfort: {
        title: 'Ajut-o să-și facă viața de zi cu zi mai ușoară în timpul cancerului mamar',
        description:
          'Cancerul mamar și durerile tot mai mari au făcut călătoriile și activitățile obișnuite dificile. Își dorește un airfryer, cărți, plante în ghiveci, o pătură moale și alte lucruri practice care să-i facă zilele puțin mai ușoare acasă.',
        privacy: 'La cererea ei, numele, imaginea și povestea completă rămân confidențiale.',
        image:
          'https://images.unsplash.com/photo-1713553680479-5b5949ca780f?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Femeie citind lângă flori și plante, cu chipul ascuns',
      },
    },
  },
  es: {
    pageTitle: 'Apoya un sueño',
    pageSubtitle:
      'Ayúdanos a crear momentos importantes para warriors cuyos sueños todavía esperan hacerse realidad.',
    goal: 'Objetivo',
    raised: 'recaudados',
    of: 'de',
    paypal: 'PayPal',
    crypto: 'Cripto',
    attribution: 'Cada donación verificada se asigna a este sueño.',
    cryptoTitle: 'Dona cripto a este sueño',
    cryptoHelp:
      'Envía a la wallet de TCW y pega el hash de la transacción. El sitio la verifica y la añade automáticamente a este sueño.',
    asset: 'Activo',
    destination: 'Destino',
    kraken: 'Kraken',
    metamask: 'MetaMask',
    address: 'Dirección de TCW',
    txHash: 'Hash de transacción',
    verify: 'Verificar donación',
    verifying: 'Verificando…',
    verified: 'La donación fue verificada y añadida a la barra de progreso.',
    copyAddress: 'Copiar dirección',
    close: 'Cerrar',
    campaigns: {
      peacefulWeekend: {
        title: 'Regala un fin de semana de paz a una abuela que enfrenta el cáncer',
        description:
          'Después de casi 40 años de trabajo y cuidado de su familia, una revisión rutinaria en marzo de 2026 cambió su vida con un diagnóstico de cáncer. Sueña con pasar un fin de semana tranquilo junto a su marido—descansar, respirar y crear un recuerdo más allá del cáncer.',
        privacy: 'Por ahora, su nombre y su imagen se mantienen en privado.',
        image:
          'https://images.unsplash.com/photo-1771923892298-268417b66dc2?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Pareja mayor caminando junta por la playa, vista desde atrás',
      },
      memoriesWithGrandchildren: {
        title: 'Ayuda a una abuela a crear recuerdos con sus nietos gemelos',
        description:
          'Vive con cáncer gástrico en estadio IV, pero sigue siendo una abuela activa y sociable que ama viajar, cocinar y estar cerca de su familia. Unos días con sus nietos gemelos adolescentes les darían un respiro de hospitales, pruebas y citas—y recuerdos duraderos.',
        privacy: 'Su nombre y su imagen no se publican en esta campaña.',
        image:
          'https://images.unsplash.com/photo-1606474226448-4aa808468efc?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Abuela y nietos caminando juntos por un bosque',
      },
      everydayComfort: {
        title: 'Ayúdala a hacer más llevadera la vida diaria durante el cáncer de mama',
        description:
          'El cáncer de mama y el dolor creciente han dificultado los viajes y las tareas cotidianas. Desea una freidora de aire, libros, plantas en maceta, una manta suave y otros artículos prácticos que hagan sus días un poco más llevaderos en casa.',
        privacy: 'A petición suya, su nombre, imagen e historia completa permanecen privados.',
        image:
          'https://images.unsplash.com/photo-1713553680479-5b5949ca780f?auto=format&fit=crop&q=80&w=1200',
        imageAlt: 'Mujer leyendo junto a flores y plantas con el rostro oculto',
      },
    },
  },
} as const;

function formatEur(value: number) {
  return value.toFixed(2).replace('.00', '');
}

export default function SupportDreamPage() {
  const locale = useLocale() as Locale;
  const text = copy[locale] ?? copy.en;
  const [raisedByCampaign, setRaisedByCampaign] =
    useState<Record<CampaignId, number>>(INITIAL_RAISED);
  const [selectedCampaignKey, setSelectedCampaignKey] =
    useState<CampaignKey | null>(null);
  const [asset, setAsset] = useState<CryptoAsset>('usdc');
  const [destination, setDestination] = useState<Destination>('kraken');
  const [txHash, setTxHash] = useState('');
  const [verificationState, setVerificationState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [verificationMessage, setVerificationMessage] = useState('');

  const selectedCampaign = selectedCampaignKey
    ? ACTIVE_DREAM_CAMPAIGNS[selectedCampaignKey]
    : null;
  const selectedCampaignText = selectedCampaignKey
    ? text.campaigns[selectedCampaignKey]
    : null;

  const loadProgress = useCallback(async () => {
    await Promise.all(
      CAMPAIGN_ENTRIES.map(async ([, campaign]) => {
        try {
          const response = await fetch(
            `/api/campaign-progress?campaignId=${encodeURIComponent(campaign.id)}`,
            {cache: 'no-store'},
          );

          if (!response.ok) return;

          const result = await response.json();
          const raisedEur = Number(result.raisedEur || 0);

          setRaisedByCampaign((current) => ({
            ...current,
            [campaign.id]: Number.isFinite(raisedEur) ? raisedEur : 0,
          }));
        } catch {
          // Keep the last verified total if the endpoint is temporarily unavailable.
        }
      }),
    );
  }, []);

  useEffect(() => {
    loadProgress();
    const interval = window.setInterval(loadProgress, 15_000);
    return () => window.clearInterval(interval);
  }, [loadProgress]);

  const cryptoAddress = useMemo(() => {
    if (asset === 'btc') return CRYPTO_ADDRESSES.btc;

    return destination === 'metamask'
      ? CRYPTO_ADDRESSES.ethMetamask
      : CRYPTO_ADDRESSES.ethKraken;
  }, [asset, destination]);

  const verifyCrypto = async () => {
    if (!selectedCampaign) return;

    setVerificationState('loading');
    setVerificationMessage('');

    try {
      const response = await fetch('/api/crypto-verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          asset,
          destination,
          txHash,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to verify donation.');
      }

      setVerificationState('success');
      setVerificationMessage(text.verified);
      setTxHash('');
      await loadProgress();
    } catch (error) {
      setVerificationState('error');
      setVerificationMessage(
        error instanceof Error ? error.message : 'Unable to verify donation.',
      );
    }
  };

  const paypalReturnUrl = `https://tutticancerwarriors.org${localizedPath(
    locale,
    'supportDream',
  )}`;

  return (
    <section className="min-h-screen bg-neutral-50 pb-24 pt-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600">
            <Sparkles className="h-4 w-4" />
            <span>Tutti Cancer Warriors</span>
          </div>
          <h1 className="mb-5 text-4xl font-bold text-neutral-900 md:text-5xl">
            {text.pageTitle}
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600">
            {text.pageSubtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGN_ENTRIES.map(([key, campaign]) => {
            const card = text.campaigns[key];
            const raisedEur = raisedByCampaign[campaign.id] ?? 0;
            const progress = Math.min(
              100,
              Math.round((raisedEur / campaign.goalEur) * 100),
            );

            return (
              <article
                key={campaign.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-brand-600 shadow-sm backdrop-blur">
                    {text.goal}: €{campaign.goalEur}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="mb-3 text-xl font-bold leading-snug text-neutral-900">
                    {card.title}
                  </h2>
                  <p className="mb-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {card.description}
                  </p>
                  <p className="mb-5 text-xs text-neutral-500">{card.privacy}</p>

                  <div
                    className="mb-5"
                    aria-label={`${raisedEur} euros raised of ${campaign.goalEur}`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
                      <span className="text-brand-600">
                        €{formatEur(raisedEur)} {text.raised}
                      </span>
                      <span className="text-neutral-500">
                        {text.of} €{campaign.goalEur}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-purple-500 transition-all duration-500"
                        style={{width: `${progress}%`}}
                      />
                    </div>
                    <div className="mt-1.5 text-right text-[11px] text-neutral-500">
                      {progress}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <form
                      action="https://www.paypal.com/donate"
                      method="post"
                      target="_blank"
                      className="w-full"
                    >
                      <input
                        type="hidden"
                        name="hosted_button_id"
                        value={PAYPAL_BUTTON_ID}
                      />
                      <input type="hidden" name="item_name" value={card.title} />
                      <input
                        type="hidden"
                        name="item_number"
                        value={campaign.id}
                      />
                      <input type="hidden" name="custom" value={campaign.id} />
                      <input type="hidden" name="currency_code" value="EUR" />
                      <input
                        type="hidden"
                        name="notify_url"
                        value="https://tutticancerwarriors.org/api/paypal-ipn"
                      />
                      <input
                        type="hidden"
                        name="return"
                        value={paypalReturnUrl}
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC439] px-3 py-3 text-sm font-bold text-neutral-900 shadow-sm transition-colors hover:bg-[#F6B828]"
                      >
                        <WalletCards className="h-4 w-4" />
                        {text.paypal}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampaignKey(key);
                        setVerificationState('idle');
                        setVerificationMessage('');
                        setTxHash('');
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-700"
                    >
                      <Bitcoin className="h-4 w-4" />
                      {text.crypto}
                    </button>
                  </div>

                  <div className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-neutral-500">
                    <Heart
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500"
                      fill="currentColor"
                    />
                    <span>{text.attribution}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedCampaign && selectedCampaignText && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {text.cryptoTitle}
                </h2>
                <p className="mt-2 text-sm font-semibold text-brand-600">
                  {selectedCampaignText.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {text.cryptoHelp}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaignKey(null)}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
                aria-label={text.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <div className="mb-2 text-sm font-bold text-neutral-700">
                  {text.asset}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['btc', 'eth', 'usdc'] as CryptoAsset[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAsset(option)}
                      className={`rounded-xl border py-2.5 text-sm font-bold transition-colors ${
                        asset === option
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-300'
                      }`}
                    >
                      {option.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {asset !== 'btc' && (
                <div>
                  <div className="mb-2 text-sm font-bold text-neutral-700">
                    {text.destination}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['kraken', 'metamask'] as Destination[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDestination(option)}
                        className={`rounded-xl border py-2.5 text-sm font-bold transition-colors ${
                          destination === option
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {option === 'kraken' ? text.kraken : text.metamask}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 text-sm font-bold text-neutral-700">
                  {text.address}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <code className="flex-1 break-all text-xs text-neutral-700">
                    {cryptoAddress}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(cryptoAddress)}
                    className="rounded-lg border border-neutral-200 bg-white p-2 hover:bg-neutral-100"
                    aria-label={text.copyAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="txHash"
                  className="mb-2 block text-sm font-bold text-neutral-700"
                >
                  {text.txHash}
                </label>
                <input
                  id="txHash"
                  value={txHash}
                  onChange={(event) => setTxHash(event.target.value)}
                  placeholder="0x… / transaction ID"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>

              {verificationMessage && (
                <div
                  className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
                    verificationState === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {verificationState === 'success' && (
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                  )}
                  <span>{verificationMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={verifyCrypto}
                disabled={!txHash.trim() || verificationState === 'loading'}
                className="w-full rounded-xl bg-brand-600 px-5 py-3.5 font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {verificationState === 'loading' ? text.verifying : text.verify}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
