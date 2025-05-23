package devybigboard;

import org.springframework.boot.builder.SpringApplicationBuilder;

public class Server extends DevyBigBoardApplication {

    public static void main(String[] args) {
        new Server().configure(new SpringApplicationBuilder())
                .initializers()
                .profiles("local", "secrets")
                .run(args);
    }

}