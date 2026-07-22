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
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Peaceful countryside landscape',
      },
      memoriesWithGrandchildren: {
        title: 'Help a Grandmother Make Memories With Her Twin Grandchildren',
        description:
          'Living with stage IV gastric cancer, she is an active grandmother who loves travelling, cooking and being close to family. A few days away with her teenage twin grandchildren would offer a breath beyond hospitals, tests and appointments—and create memories they can carry with them.',
        privacy: 'Her name and image are not published on this campaign.',
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Open landscape at sunset',
      },
      everydayComfort: {
        title: 'Help Make Everyday Life Gentler During Breast Cancer',
        description:
          'Breast cancer and increasing pain have made travel and ordinary tasks difficult. Her wish is for practical, non-medical items that bring comfort, independence and small moments of joy at home.',
        privacy: 'At her request, her name, image and full story remain private.',
        statusNote: 'Her final wish list is being confirmed.',
        image:
          'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Warm and peaceful home interior',
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
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Peisaj liniștit de țară',
      },
      memoriesWithGrandchildren: {
        title: 'Ajută o bunică să creeze amintiri cu nepoții ei gemeni',
        description:
          'Trăiește cu neoplasm gastric în stadiul IV, dar rămâne o bunică activă, sociabilă, care iubește călătoriile, gătitul și timpul petrecut cu familia. Câteva zile alături de nepoții ei gemeni adolescenți le-ar oferi o pauză de la spitale, analize și programări—și amintiri care să rămână.',
        privacy: 'Numele și imaginea ei nu sunt publicate în această campanie.',
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Peisaj deschis la apus',
      },
      everydayComfort: {
        title: 'Ajut-o să-și facă viața de zi cu zi mai ușoară în timpul cancerului mamar',
        description:
          'Cancerul mamar și durerile tot mai mari au făcut călătoriile și activitățile obișnuite dificile. Își dorește obiecte practice, non-medicale, care să-i ofere confort, mai multă independență și mici bucurii acasă.',
        privacy: 'La cererea ei, numele, imaginea și povestea completă rămân confidențiale.',
        statusNote: 'Lista finală a dorințelor este în curs de confirmare.',
        image:
          'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Interior cald și liniștit',
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
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Paisaje rural tranquilo',
      },
      memoriesWithGrandchildren: {
        title: 'Ayuda a una abuela a crear recuerdos con sus nietos gemelos',
        description:
          'Vive con cáncer gástrico en estadio IV, pero sigue siendo una abuela activa y sociable que ama viajar, cocinar y estar cerca de su familia. Unos días con sus nietos gemelos adolescentes les darían un respiro de hospitales, pruebas y citas—y recuerdos duraderos.',
        privacy: 'Su nombre y su imagen no se publican en esta campaña.',
        statusNote: '',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Paisaje abierto al atardecer',
      },
      everydayComfort: {
        title: 'Ayúdala a hacer más llevadera la vida diaria durante el cáncer de mama',
        description:
          'El cáncer de mama y el dolor creciente han dificultado los viajes y las tareas cotidianas. Su deseo es recibir artículos prácticos y no médicos que le aporten comodidad, independencia y pequeños momentos de alegría en casa.',
        privacy: 'A petición suya, su nombre, imagen e historia completa permanecen privados.',
        statusNote: 'La lista final de deseos está pendiente de confirmación.',
        image:
          'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'Interior cálido y tranquilo',
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
    <section className="pt-32 pb-24 bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-bold mb-5">
            <Sparkles className="w-4 h-4" />
            <span>Tutti Cancer Warriors</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-5">
            {text.pageTitle}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {text.pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto items-stretch">
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
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-brand-600 shadow-sm">
                    {text.goal}: €{campaign.goalEur}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-neutral-900 mb-3 leading-snug">
                    {card.title}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-2 flex-1">
                    {card.description}
                  </p>
                  <p className="text-xs text-neutral-500 mb-2">{card.privacy}</p>
                  {card.statusNote && (
                    <p className="text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                      {card.statusNote}
                    </p>
                  )}

                  <div
                    className="mb-5 mt-3"
                    aria-label={`${raisedEur} euros raised of ${campaign.goalEur}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 text-xs font-semibold">
                      <span className="text-brand-600">
                        €{formatEur(raisedEur)} {text.raised}
                      </span>
                      <span className="text-neutral-500">
                        {text.of} €{campaign.goalEur}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full transition-all duration-500"
                        style={{width: `${progress}%`}}
                      />
                    </div>
                    <div className="text-right text-[11px] text-neutral-500 mt-1.5">
                      {progress}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <form
                      action="https://www.paypal.com/donate"
                      method="post"
                      target="_blank"
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
                      <input type="hidden" name="return" value={paypalReturnUrl} />
                      <button
                        type="submit"
                        className="w-full py-3 px-3 bg-[#FFC439] hover:bg-[#F6B828] text-neutral-900 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <WalletCards className="w-4 h-4" />
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
                      className="py-3 px-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Bitcoin className="w-4 h-4" />
                      {text.crypto}
                    </button>
                  </div>

                  <div className="mt-4 flex items-start justify-center gap-2 text-xs text-neutral-500 text-center">
                    <Heart
                      className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5"
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
        <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {text.cryptoTitle}
                </h2>
                <p className="text-sm font-semibold text-brand-600 mt-2">
                  {selectedCampaignText.title}
                </p>
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                  {text.cryptoHelp}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaignKey(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
                aria-label={text.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="text-sm font-bold text-neutral-700 mb-2">
                  {text.asset}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['btc', 'eth', 'usdc'] as CryptoAsset[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAsset(option)}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                        asset === option
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-brand-300'
                      }`}
                    >
                      {option.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {asset !== 'btc' && (
                <div>
                  <div className="text-sm font-bold text-neutral-700 mb-2">
                    {text.destination}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['kraken', 'metamask'] as Destination[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDestination(option)}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                          destination === option
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {option === 'kraken' ? text.kraken : text.metamask}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-bold text-neutral-700 mb-2">
                  {text.address}
                </div>
                <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <code className="text-xs text-neutral-700 break-all flex-1">
                    {cryptoAddress}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(cryptoAddress)}
                    className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100"
                    aria-label={text.copyAddress}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="txHash"
                  className="text-sm font-bold text-neutral-700 block mb-2"
                >
                  {text.txHash}
                </label>
                <input
                  id="txHash"
                  value={txHash}
                  onChange={(event) => setTxHash(event.target.value)}
                  placeholder="0x… / transaction ID"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>

              {verificationMessage && (
                <div
                  className={`p-3 rounded-xl text-sm flex items-start gap-2 ${
                    verificationState === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {verificationState === 'success' && (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  )}
                  <span>{verificationMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={verifyCrypto}
                disabled={!txHash.trim() || verificationState === 'loading'}
                className="w-full py-3.5 px-5 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
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
