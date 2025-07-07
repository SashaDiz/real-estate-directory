import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Send,
  CheckCircle
} from 'lucide-react';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      description: 'Пн-Пт 9:00-18:00 EST'
    },
    {
      icon: Mail,
      title: 'Электронная почта',
      details: ['info@propertyhub.com', 'sales@propertyhub.com'],
      description: 'Отвечаем в течение 24 часов'
    },
    {
      icon: MapPin,
      title: 'Офис',
      details: ['Бизнес-авеню, 123', 'Деловой район', 'Нью-Йорк, NY 10001'],
      description: 'Посещение по предварительной записи'
    },
    {
      icon: Clock,
      title: 'Часы работы',
      details: ['Понедельник - Пятница: 9:00 - 18:00', 'Суббота: 10:00 - 16:00', 'Воскресенье: Закрыто'],
      description: 'Экстренная связь доступна 24/7'
    }
  ];

  const team = [
    {
      name: 'Сара Джонсон',
      role: 'Старший специалист по недвижимости',
      email: 'sarah@propertyhub.com',
      phone: '+1 (555) 123-4567',
      specialties: ['Офисные здания', 'Корпоративная аренда']
    },
    {
      name: 'Майкл Чен',
      role: 'Эксперт по розничной недвижимости',
      email: 'michael@propertyhub.com',
      phone: '+1 (555) 234-5678',
      specialties: ['Торговые площади', 'Торговые центры']
    },
    {
      name: 'Дэвид Родригес',
      role: 'Менеджер по промышленной недвижимости',
      email: 'david@propertyhub.com',
      phone: '+1 (555) 345-6789',
      specialties: ['Склады', 'Производство']
    },
    {
      name: 'Лиза Томпсон',
      role: 'Консультант по развитию земель',
      email: 'lisa@propertyhub.com',
      phone: '+1 (555) 456-7890',
      specialties: ['Коммерческие земли', 'Проекты развития']
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Готовы найти идеальное коммерческое помещение? Наша команда экспертов готова помочь вам на каждом шагу.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Отправить сообщение
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Сообщение успешно отправлено!
                    </h3>
                    <p className="text-gray-600">
                      Спасибо за ваш запрос. Мы свяжемся с вами в течение 24 часов.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Ваше имя"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Ваш Email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="tel"
                        placeholder="Ваш телефон"
                        value={contactForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                      <Input
                        placeholder="Тема"
                        value={contactForm.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>
                    <Textarea
                      placeholder="Ваше сообщение"
                      value={contactForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      required
                    />
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Отправить сообщение
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                      <div className="space-y-1 mb-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Наша команда
            </h2>
            <p className="text-lg text-gray-600">
              Наши опытные специалисты готовы помочь вам найти идеальный объект недвижимости
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Специализация:</p>
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Независимо от того, хотите ли вы купить, арендовать или инвестировать в коммерческую недвижимость,
              наша команда обладает опытом, чтобы привести вас к успеху.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Позвонить сейчас
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Mail className="mr-2 h-4 w-4" />
                Написать нам
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;


