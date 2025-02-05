"use client";
import Link from "next/link";
import { useTheme } from "../Context/ThemeContext";
import Image from "next/image";

export default function AboutUs() {
  const { bgColor } = useTheme();

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center py-16"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl w-full px-6 sm:px-8 lg:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 pb-4 border-b-4 border-green-600">
          About Us
        </h1>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div className="relative w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/logo.png"
              alt="About Us"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="space-y-6 text-lg">
            <h2 className="text-3xl font-semibold text-green-700">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Nepal is predominantly an agrarian country, with the agricultural
              sector contributing approximately 24% to the national Gross
              Domestic Product (GDP) and sustaining the livelihoods of nearly
              67% of the population. This sector is integral to the nation&#39;s
              economic development and food security. However, the provision of
              agricultural extension services by governmental and other related
              stakeholders is often neither timely nor effective, adversely
              affecting agricultural production and marketing systems. The
              dissemination of timely and accurate information concerning
              production technologies, pest and disease management,
              meteorological forecasts, and market dynamics is critical for the
              commercialization and modernization of agriculture. Despite the
              sector&#39;s significance, mainstream media in Nepal have largely
              neglected comprehensive coverage of agricultural issues.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              In response to these challenges, Krishi Sanjal
              (www.krishisanjal.com) was established to facilitate the
              dissemination of pertinent agricultural news and information to
              farmers and related stakeholders. Krishi Sanjal represents a
              collaborative initiative between agricultural experts and mass
              media professionals, aiming to provide scientifically sound,
              timely, and practical information tailored to the needs of the
              agricultural community.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-10 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg text-justify">
              The mission of Krishi Sanjal is to bridge the informational gap
              between governmental bodies, farmers, and commercial agricultural
              enterprises through the dissemination of precise and actionable
              information. By fostering effective communication and ensuring the
              timely delivery of agricultural information, knowledge, the
              platform aims to empower farmers. Krishi Sanjal is committed to
              serving as a dependable information conduit that supports the
              growth, innovation, and sustainability of Nepal&#39;s agricultural
              sector.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-10 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg text-justify">
              The long-term vision of Krishi Sanjal is to function as a
              responsible and influential media platform within the agricultural
              sector. The platform aspires to contribute to the evolution of a
              modern, dynamic, efficient, and sustainable agricultural system by
              enhancing agricultural practices and facilitating access to
              accurate, relevant information.
            </p>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-green-700 mb-6">
            Join Us on Our Journey
          </h3>
          <p className="text-gray-700 text-lg mb-8">
            We're always looking for passionate individuals to join our team. If
            you're excited about making a difference and pushing the boundaries
            of what's possible, we'd love to hear from you.
          </p>
          <Link href="/contact" className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-colors duration-300 hover:bg-green-700">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
