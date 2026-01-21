"use client";

import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaUser,
  FaUserShield,
  FaUserTie,
  FaBars,
  FaTimes,
  FaHospital,
  FaAmbulance,
  FaStethoscope,
  FaCalendarCheck,
  FaPrescriptionBottle,
  FaBed,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaMoon,
  FaSun,
  FaHeartbeat,
  FaXRay,
  FaMicroscope,
  FaClock,
  FaCheckCircle,
  FaAward,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

export default function HospitalLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const topDoctors = [
    {
      name: "Dr. Ahmed Khan",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Ayesha Malik",
      specialty: "Neurologist",
      experience: "12 years",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Hassan Ali",
      specialty: "Orthopedic",
      experience: "18 years",
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Fatima Noor",
      specialty: "Pediatrician",
      experience: "10 years",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
  ];

  const stats = [
    { icon: <FaUsers />, count: "50,000+", label: "Happy Patients" },
    { icon: <FaUserMd />, count: "200+", label: "Expert Doctors" },
    { icon: <FaHospital />, count: "25+", label: "Departments" },
    { icon: <FaAward />, count: "100+", label: "Awards Won" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Enhanced Navbar */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? darkMode
              ? "bg-gray-800/95 backdrop-blur-md shadow-2xl"
              : "bg-white/95 backdrop-blur-md shadow-2xl"
            : darkMode
              ? "bg-gray-800"
              : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo with Animation */}
            <div className="flex items-center group">
              <div className="relative">
                <FaHospital
                  className={`text-4xl mr-3 transition-all duration-300 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } group-hover:scale-110 group-hover:rotate-6`}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  HealthCare
                </span>
                <span className="text-blue-600 text-2xl font-bold"> HMS</span>
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Healthcare Excellence
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                "Home",
                "Services",
                "Doctors",
                "Features",
                "Testimonials",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>

              {/* Login Icons - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 group ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                  }`}
                >
                  <FaUser className="text-blue-600 mr-1 group-hover:scale-110 transition" />
                  <span
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Patient
                  </span>
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 group ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-green-50"
                  }`}
                >
                  <FaUserMd className="text-green-600 mr-1 group-hover:scale-110 transition" />
                  <span
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Doctor
                  </span>
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 group ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                  }`}
                >
                  <FaUserTie className="text-purple-600 mr-1 group-hover:scale-110 transition" />
                  <span
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Admin
                  </span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-lg ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t`}
          >
            <div className="px-4 py-4 space-y-3">
              {[
                "Home",
                "Services",
                "Doctors",
                "Features",
                "Testimonials",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block py-2 rounded-lg px-3 ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

              <div className="pt-4 border-t border-gray-700 space-y-2">
                {[
                  { icon: <FaUser />, label: "Patient", color: "blue" },
                  { icon: <FaUserMd />, label: "Doctor", color: "green" },
                  { icon: <FaUserTie />, label: "Admin", color: "purple" },
                  {
                    icon: <FaUserShield />,
                    label: "Super Admin",
                    color: "red",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition ${
                      darkMode
                        ? `bg-${item.color}-900/30 hover:bg-${item.color}-900/50`
                        : `bg-${item.color}-50 hover:bg-${item.color}-100`
                    }`}
                  >
                    <span className={`text-${item.color}-600 mr-2`}>
                      {item.icon}
                    </span>
                    <span
                      className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {item.label} Login
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section
        id="home"
        className={`pt-32 pb-20 ${
          darkMode
            ? " from-gray-800 via-gray-900 to-blue-900"
            : " from-blue-50 via-white to-purple-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-600/10 px-4 py-2 rounded-full">
                <FaHeartbeat className="text-blue-600 animate-pulse" />
                <span
                  className={`text-sm font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  #1 Hospital Management System
                </span>
              </div>

              <h1
                className={`text-5xl lg:text-6xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } leading-tight`}
              >
                Advanced Hospital Management
                <span className="text-blue-600"> Made Simple</span>
              </h1>

              <p
                className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Transform your healthcare facility with our comprehensive
                management solution. Streamline operations, enhance patient
                care, and boost efficiency all in one platform.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started Free
                </button>
                <button
                  className={`px-8 py-4 rounded-xl transition font-semibold border-2 shadow-lg ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                      : "bg-white text-blue-600 border-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-xl ${
                      darkMode ? "bg-gray-800/50" : "bg-white/50"
                    } backdrop-blur-sm`}
                  >
                    <div className="text-3xl text-blue-600 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div
                      className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {stat.count}
                    </div>
                    <div
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0  from-blue-600 to-purple-600 rounded-3xl transform rotate-6 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"
                alt="Hospital"
                className="rounded-3xl shadow-2xl w-full h-auto relative z-10 transform hover:scale-105 transition duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl z-20">
                <FaCheckCircle className="text-4xl mb-2" />
                <p className="font-bold">24/7 Support</p>
                <p className="text-sm text-blue-200">Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className={`py-20 ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold mt-3 mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Comprehensive Healthcare Solutions
            </h2>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto text-lg`}
            >
              Everything you need to run a modern, efficient healthcare facility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaAmbulance />,
                title: "Emergency Care",
                desc: "24/7 emergency services with rapid response teams",
                color: "blue",
              },
              {
                icon: <FaStethoscope />,
                title: "Expert Consultation",
                desc: "Access to specialized doctors and healthcare professionals",
                color: "green",
              },
              {
                icon: <FaCalendarCheck />,
                title: "Appointment System",
                desc: "Easy online booking and schedule management",
                color: "purple",
              },
              {
                icon: <FaPrescriptionBottle />,
                title: "Pharmacy Management",
                desc: "Integrated prescription and medication tracking",
                color: "red",
              },
              {
                icon: <FaBed />,
                title: "Bed Management",
                desc: "Real-time bed availability and patient admission",
                color: "yellow",
              },
              {
                icon: <FaXRay />,
                title: "Diagnostic Services",
                desc: "Advanced imaging and laboratory facilities",
                color: "indigo",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-750"
                    : `bg-${service.color}-50 hover:bg-${service.color}-100`
                }`}
              >
                <div
                  className={`text-6xl mb-4 text-${service.color}-600 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3
                  className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {service.title}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section
        id="doctors"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Our Experts
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold mt-3 mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Meet Our Top Doctors
            </h2>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto text-lg`}
            >
              Experienced healthcare professionals dedicated to your wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topDoctors.map((doctor, index) => (
              <div
                key={index}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  darkMode ? "bg-gray-900" : "bg-white"
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 px-3 py-1 rounded-full flex items-center space-x-1">
                    <FaStar className="text-white text-sm" />
                    <span className="text-white font-bold text-sm">
                      {doctor.rating}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-2" />
                    <span>{doctor.experience} Experience</span>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`py-20 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2
                className={`text-4xl font-bold mt-3 mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Your Health is Our Priority
              </h2>
              <p
                className={`text-lg mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                We combine cutting-edge technology with compassionate care to
                deliver exceptional healthcare services.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <FaCheckCircle />,
                    text: "State-of-the-art medical equipment",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "Highly qualified and experienced doctors",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "24/7 emergency care available",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "Affordable and transparent pricing",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "Patient-centered approach",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">{item.icon}</span>
                    <span
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}
              >
                <FaMicroscope className="text-5xl text-blue-600 mb-3" />
                <h4
                  className={`font-bold text-2xl mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Advanced Labs
                </h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Modern diagnostic facilities
                </p>
              </div>
              <div
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-green-50"}`}
              >
                <FaHeartbeat className="text-5xl text-green-600 mb-3" />
                <h4
                  className={`font-bold text-2xl mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  ICU Care
                </h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Critical care units
                </p>
              </div>
              <div
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-purple-50"}`}
              >
                <FaChartLine className="text-5xl text-purple-600 mb-3" />
                <h4
                  className={`font-bold text-2xl mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Health Analytics
                </h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Data-driven insights
                </p>
              </div>
              <div
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-red-50"}`}
              >
                <FaAmbulance className="text-5xl text-red-600 mb-3" />
                <h4
                  className={`font-bold text-2xl mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Ambulance
                </h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Quick emergency response
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Platform Features
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold mt-3 mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Everything You Need in One Place
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Patient Records Management",
              "Billing & Insurance",
              "Staff Management",
              "Reports & Analytics",
              "Laboratory Integration",
              "Security & Compliance",
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  darkMode ? "bg-gray-900" : "bg-white"
                }`}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {feature}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Advanced tools and features designed for modern healthcare
                  management.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className={`py-20 ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold mt-3 mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "This HMS has transformed how we manage our hospital. The patient management system is incredibly efficient and user-friendly.",
                name: "Dr. Sarah Ahmed",
                role: "Chief Medical Officer",
                image:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
                color: "blue",
              },
              {
                text: "The appointment scheduling and billing features have saved us countless hours. Highly recommend for any healthcare facility.",
                name: "Ali Hassan",
                role: "Hospital Administrator",
                image:
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
                color: "green",
              },
              {
                text: "Outstanding support and features. The system has improved our patient care quality and operational efficiency significantly.",
                name: "Dr. Fatima Khan",
                role: "Senior Physician",
                image:
                  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
                color: "purple",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl ${
                  darkMode
                    ? `bg-gray-800 hover:bg-gray-750`
                    : `bg-${testimonial.color}-50`
                }`}
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <p
                  className={`mb-6 text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 border-4 border-white shadow-lg"
                  />
                  <div>
                    <h4
                      className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Contact Us
              </span>
              <h2
                className={`text-4xl font-bold mt-3 mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Get In Touch
              </h2>
              <p
                className={`mb-8 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Have questions? We're here to help. Contact us for more
                information about our Hospital Management System.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <FaMapMarkerAlt />,
                    title: "Address",
                    text: "123 Healthcare Street, Rawalpindi, Punjab, Pakistan",
                  },
                  { icon: <FaPhone />, title: "Phone", text: "+92 51 1234567" },
                  {
                    icon: <FaEnvelope />,
                    title: "Email",
                    text: "info@healthcarehms.com",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4
                        className={`font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`p-8 rounded-2xl shadow-xl ${darkMode ? "bg-gray-900" : "bg-white"}`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Send us a message
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
                  ></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={
          darkMode ? "bg-gray-900 text-white" : "bg-gray-900 text-white"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <FaHospital className="text-blue-400 text-3xl mr-2" />
                <span className="text-xl font-bold">HealthCare HMS</span>
              </div>
              <p className="text-gray-400 mb-4">
                Leading hospital management solution for modern healthcare
                facilities.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  "Home",
                  "Services",
                  "Doctors",
                  "Features",
                  "Testimonials",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                {[
                  "Patient Management",
                  "Appointment Booking",
                  "Billing System",
                  "Reports & Analytics",
                ].map((service) => (
                  <li key={service} className="text-gray-400">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Rawalpindi, Pakistan</li>
                <li className="text-gray-400">+92 51 1234567</li>
                <li className="text-gray-400">info@healthcarehms.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2026 HealthCare HMS. All rights reserved. Made with ❤️ for
              better healthcare
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
