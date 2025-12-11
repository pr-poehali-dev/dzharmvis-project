import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  date: string;
}

interface Reminder {
  id: number;
  text: string;
  time: string;
}

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [jarvisMessage, setJarvisMessage] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.85;
    utterance.pitch = 0.75;
    utterance.volume = 1.0;
    
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      (voice.lang.includes('ru-RU') || voice.lang.includes('ru')) && 
      (voice.name.toLowerCase().includes('male') || 
       voice.name.includes('Yuri') || 
       voice.name.includes('Maxim') ||
       voice.name.includes('Google русский'))
    );
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    } else {
      const anyRussianVoice = voices.find(voice => 
        voice.lang.includes('ru-RU') || voice.lang.includes('ru')
      );
      if (anyRussianVoice) {
        utterance.voice = anyRussianVoice;
      }
    }
    
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'ru-RU';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    }

    const timer = setTimeout(() => {
      setJarvisMessage('Добрый день, сэр. Все системы в норме.');
      speak('Добрый день, сэр. Все системы в норме.');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('привет') || lowerCommand.includes('здравствуй')) {
      return 'Добрый день, сэр. Рад вас приветствовать.';
    }
    if (lowerCommand.includes('как дела') || lowerCommand.includes('как ты')) {
      return 'Все системы функционируют в штатном режиме, сэр.';
    }
    if (lowerCommand.includes('время') || lowerCommand.includes('который час')) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `Сейчас ${hours} часов ${minutes} минут, сэр.`;
    }
    if (lowerCommand.includes('дата') || lowerCommand.includes('какое число') || lowerCommand.includes('сегодня')) {
      const now = new Date();
      const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      return `Сегодня ${date}, сэр.`;
    }
    if (lowerCommand.includes('задач') || lowerCommand.includes('дел')) {
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      return `У вас ${total} задач, выполнено ${completed}, сэр.`;
    }
    if (lowerCommand.includes('встреч') || lowerCommand.includes('событий') || lowerCommand.includes('календарь')) {
      const todayEvents = events.filter(e => e.date === 'Сегодня').length;
      return `На сегодня запланировано ${todayEvents} встреч, сэр.`;
    }
    if (lowerCommand.includes('напоминан')) {
      return `У вас ${reminders.length} активных напоминаний, сэр.`;
    }
    if (lowerCommand.includes('спасибо')) {
      return 'Всегда пожалуйста, сэр. Рад быть полезным.';
    }
    if (lowerCommand.includes('кто ты') || lowerCommand.includes('что ты')) {
      return 'Я Джарвис. Ваш персональный ассистент, сэр.';
    }
    
    return 'Прошу прощения, сэр. Я не совсем понял ваш вопрос. Попробуйте переформулировать.';
  };
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Позвонить клиенту по проекту', completed: false },
    { id: 2, title: 'Отправить отчёт руководству', completed: true },
    { id: 3, title: 'Подготовить презентацию', completed: false },
    { id: 4, title: 'Провести встречу команды', completed: false },
  ]);

  const [events] = useState<CalendarEvent[]>([
    { id: 1, title: 'Встреча с командой', time: '10:00', date: 'Сегодня' },
    { id: 2, title: 'Презентация проекта', time: '14:00', date: 'Сегодня' },
    { id: 3, title: 'Звонок с инвестором', time: '16:30', date: 'Сегодня' },
    { id: 4, title: 'Планирование спринта', time: '09:00', date: 'Завтра' },
  ]);

  const [reminders] = useState<Reminder[]>([
    { id: 1, text: 'Купить подарок на день рождения', time: '18:00' },
    { id: 2, text: 'Оплатить счета', time: '20:00' },
    { id: 3, text: 'Забрать документы', time: 'Завтра 12:00' },
  ]);

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    
    if (task && !task.completed) {
      const messages = [
        'Задача выполнена, сэр. Отличная работа.',
        'Отмечаю как выполненное, сэр.',
        'Задача завершена. Двигаемся дальше.',
        'Превосходно, сэр.'
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setJarvisMessage(randomMessage);
      speak(randomMessage);
    } else if (task) {
      setJarvisMessage('Задача возобновлена, сэр.');
      speak('Задача возобновлена, сэр.');
    }
  };

  const handleVoiceClick = () => {
    if (!isListening && recognition) {
      setIsListening(true);
      setUserQuestion('');
      const greetings = [
        'Да, сэр. Я слушаю.',
        'К вашим услугам, сэр.',
        'Чем могу помочь?',
        'Я здесь, сэр.',
        'Готов к работе, сэр.'
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setJarvisMessage(randomGreeting);
      speak(randomGreeting);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserQuestion(transcript);
        setIsListening(false);
        
        const response = processCommand(transcript);
        setTimeout(() => {
          setJarvisMessage(response);
          speak(response);
        }, 500);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setJarvisMessage('Прошу прощения, не удалось распознать речь, сэр.');
        speak('Прошу прощения, не удалось распознать речь, сэр.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2 tracking-tight">
            J.A.R.V.I.S.
          </h1>
          <p className="text-muted-foreground text-lg">
            Just A Rather Very Intelligent System
          </p>
        </div>

        <div className="flex justify-center mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Button
              size="lg"
              className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-300 ${
                isListening 
                  ? 'bg-secondary hover:bg-secondary/90 scale-110' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              onClick={handleVoiceClick}
            >
              <Icon 
                name={isListening ? "AudioLines" : "Mic"} 
                size={48}
                className="text-primary-foreground"
              />
            </Button>
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-secondary/40 animate-pulse-ring" />
                <div 
                  className="absolute inset-0 rounded-full bg-secondary/30 animate-pulse-ring" 
                  style={{ animationDelay: '0.5s' }}
                />
              </>
            )}
          </div>
        </div>

        <div className="text-center mb-8 min-h-[80px] flex flex-col justify-center">
          {userQuestion && (
            <p className="text-lg text-muted-foreground mb-2 animate-fade-in">
              Вы: "{userQuestion}"
            </p>
          )}
          {jarvisMessage && (
            <p className="text-xl text-secondary font-medium italic animate-fade-in">
              "{jarvisMessage}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-2" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="Calendar" size={28} className="text-primary" />
                Календарь
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {event.date}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-2" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="CheckSquare" size={28} className="text-primary" />
                Задачи
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                      task.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </label>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Выполнено: {tasks.filter(t => t.completed).length} из {tasks.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-2" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="Bell" size={28} className="text-primary" />
                Напоминания
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  className="p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors duration-200 border border-accent/40"
                >
                  <p className="text-foreground mb-2">{reminder.text}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>{reminder.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icon name="Zap" size={32} className="text-primary mb-2" />
              <p className="text-sm font-medium text-center">Быстрые действия</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icon name="Settings" size={32} className="text-primary mb-2" />
              <p className="text-sm font-medium text-center">Настройки</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icon name="User" size={32} className="text-primary mb-2" />
              <p className="text-sm font-medium text-center">Профиль</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icon name="MessageSquare" size={32} className="text-primary mb-2" />
              <p className="text-sm font-medium text-center">Сообщения</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;