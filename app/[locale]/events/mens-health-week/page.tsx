'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function MensHealthWeekPage() {
  // 🎯 EDITABLE: Cambia estas fechas y contenido
  const eventData = {
    title: "Men's Health Week",
    subtitle: "June 10-16, 2025",
    theme: "Taking Control of Your Health",
    color: "cyan", // cyan, blue, purple, green, amber
    dates: {
      start: "June 10",
      end: "June 16",
      year: "2025"
    },
    activities: [
      { day: "Monday", title: "Kick-off Webinar", desc: "Understanding Men's Cancer Risks" },
      { day: "Tuesday", title: "Nutrition Workshop", desc: "Healthy Eating for Cancer Prevention" },
      { day: "Wednesday", title: "Exercise Challenge", desc: "30-Day Fitness for Warriors" },
      { day: "Thursday", title: "Mental Health Session", desc: "Coping Strategies & Support" },
      { day: "Friday", title: "Q&A with Doctors", desc: "Ask Anything About Men's Health" },
      { day: "Saturday", title: "Community Walk", desc: "5K Walk for Awareness" },
    ]
  };

  const colorClasses = {
    cyan: "from-cyan-50 to-blue-50 border-cyan-100 text-cyan-600",
    blue: "from-blue-50 to-indigo-50 border-blue-100 text-blue-600",
    purple: "from-purple-50 to-pink-50 border-purple-100 text-purple-600",
    green: "from-green-50 to-emerald-50 border-green-100 text-green-600",
    amber: "from-amber-50 to-orange-50 border-amber-100 text-amber-600",
  };

  const bgGradient = {
    cyan: "from-cyan-600 to-blue-600",
    blue: "from-blue-600 to-indigo-600",
    purple: "from-purple-600 to-pink-600",
    green: "from-green-600 to-emerald-600",
    amber: "from-amber-600 to-orange-600",
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      <section className={`py-20 bg-gradient-to-br ${colorClasses[eventData.color as keyof typeof colorClasses]}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-semibold mb-6">
            {eventData.dates.start} - {eventData.dates.end}, {eventData.dates.year}
          </div>
          <h1 className="text-6xl font-bold text-neutral-900 mb-6">
            {eventData.title}
          </h1>
          <p className="text-2xl text-neutral-700 font-semibold max-w-2xl mx-auto">
            {eventData.theme}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">
              Week Schedule
            </h2>
            <div className="space-y-6">
              {eventData.activities.map((activity, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border-2 border-neutral-100 hover:border-cyan-300 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="text-sm font-semibold text-cyan-600">{activity.day}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{activity.title}</h3>
                      <p className="text-neutral-600">{activity.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 bg-gradient-to-br ${bgGradient[eventData.color as keyof typeof bgGradient]}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Us!
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Be part of this important week dedicated to men’s health awareness and cancer prevention.
          </p>
          <Link
            href="/involucrate"
            className="inline-block px-10 py-5 bg-white text-cyan-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-all"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </div>
  );
}
