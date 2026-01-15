'use client';

import React from 'react';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      content: 'This program completely transformed my approach to life. I\'ve achieved more in 6 months than I did in the previous 2 years.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Executive',
      content: 'The blueprint provided clarity I never had before. It\'s like having a roadmap to success that actually works.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      content: 'I finally understand my true potential. The self-discovery process was eye-opening and life-changing.',
      rating: 5,
    },
    {
      name: 'David Thompson',
      role: 'Life Coach',
      content: 'As someone who helps others, I was amazed by how much this helped me personally. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Lisa Anderson',
      role: 'Consultant',
      content: 'The structured approach made all the difference. I went from feeling stuck to having clear direction.',
      rating: 5,
    },
    {
      name: 'James Wilson',
      role: 'Investor',
      content: 'Best investment I\'ve made in myself. The results speak for themselves - I\'m achieving goals I never thought possible.',
      rating: 5,
    },
  ];

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
          What People Are Saying
        </h2>
        <p className="text-lg sm:text-xl text-gray-600">
          Join thousands who have transformed their lives
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-4 sm:gap-6">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-80 bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
            >
              <div className="flex mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 italic leading-relaxed text-sm sm:text-base">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <p className="font-semibold text-black text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
