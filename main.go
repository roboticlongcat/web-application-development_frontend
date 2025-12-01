package main

import (
	"flag"
	"fmt"
	"log"
	"strings"
	"time"

	"sample/internal/app/config"
	"sample/internal/app/dsn"
	"sample/internal/app/handler"
	"sample/internal/app/minio"
	"sample/internal/app/repository"
	"sample/internal/pkg"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func main() {
	// Добавьте флаги для переопределения конфига
	host := flag.String("host", "", "Server host (overrides config)")
	port := flag.Int("port", 0, "Server port (overrides config)")
	flag.Parse()

	router := gin.Default()
	conf, err := config.NewConfig()
	if err != nil {
		logrus.Fatalf("error loading config: %v", err)
	}
	router.Use(cors.New(cors.Config{
		// Разрешенные origins (источники)
		AllowOrigins: []string{
			// Локальная разработка
			"http://localhost:3000", // Vite dev server
			"http://127.0.0.1:3000", // альтернативный localhost
			"http://localhost:8080", // Сам бэкенд (если нужно)
			"http://localhost:5500", // Live Server (VS Code)

			// Ваши локальные IP (важно для мобильных устройств и других ПК в сети)
			"http://192.168.1.77:3000",  // ваш текущий IP
			"http://192.168.1.77:8080",  // если обращаетесь напрямую
			"https://192.168.1.77:3000", // HTTPS версия

			"http://192.168.56.1:3000",  // ваш текущий IP
			"http://192.168.56.1:8080",  // если обращаетесь напрямую
			"https://192.168.56.1:3000", // HTTPS версия

			// Другие локальные адреса которые вы используете
			"http://172.18.224.1:3000",  // ваша текущая локальная сеть
			"https://172.18.224.1:3000", // HTTPS версия

			// Production/деплой
			"https://roboticlongcat.github.io", // GitHub Pages

			// Tauri desktop app (если нужно)
			"http://tauri.localhost", // альтернативный для Tauri
		},

		// Разрешенные HTTP методы
		AllowMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH",
		},

		// Разрешенные заголовки (можно добавить специфичные)
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
			"X-CSRF-Token",
			"X-Requested-With",
			"Accept",
			"Cache-Control",
			"User-Agent",
		},

		// Разрешить куки/авторизацию
		AllowCredentials: true,

		// Заголовки, доступные для JS
		ExposeHeaders: []string{
			"Content-Length",
			"Authorization",
			"Content-Disposition",
			"X-Total-Count",     // если используете пагинацию
			"X-RateLimit-Limit", // если есть лимиты
			"X-RateLimit-Remaining",
		},

		// Максимальное время кэширования preflight запроса
		MaxAge: 12 * time.Hour,

		// Функция для динамической проверки origins
		AllowOriginFunc: func(origin string) bool {
			// Для разработки можно разрешить все локальные адреса
			// Это безопаснее чем разрешать все (AllowAllOrigins)
			if strings.Contains(origin, "localhost") ||
				strings.Contains(origin, "127.0.0.1") ||
				strings.Contains(origin, "github.io") ||
				strings.Contains(origin, "192.168.") ||
				strings.Contains(origin, "172.") {
				return true
			}

			// Логируем неразрешенные origins для отладки
			logrus.WithField("origin", origin).Warn("CORS: blocked origin")
			return false
		},
	}))

	// Переопределяем конфиг если переданы флаги
	if *host != "" {
		conf.ServiceHost = *host
	}
	if *port != 0 {
		conf.ServicePort = *port
	}

	postgresString := dsn.FromEnv()
	fmt.Println(postgresString)

	minioClient, err := minio.NewMinioClient(
		"localhost:9000",
		"minio",
		"minio124",
		"test",
		false,
	)
	if err != nil {
		logrus.Fatalf("error initializing MinIO client: %v", err)
	}
	log.Println("MinIO client initialized successfully")

	rep, errRep := repository.New(postgresString, minioClient)
	if errRep != nil {
		logrus.Fatalf("error initializing repository: %v", errRep)
	}

	hand := handler.NewHandler(rep)

	application := pkg.NewApp(conf, router, hand)
	application.RunApp()
}
