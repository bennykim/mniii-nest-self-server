import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const signupUrl = '/auth/signup';
    const dto: AuthDto = {
      email: 'test@email.com',
      password: '123',
    };

    describe('Sign Up', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(signupUrl)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(signupUrl)
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post(signupUrl).expectStatus(400);
      });

      it('should signup', () => {
        return pactum.spec().post(signupUrl).withBody(dto).expectStatus(201);
      });
    });

    describe('Sign In', () => {
      const signinUrl = '/auth/signin';

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(signinUrl)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(signinUrl)
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post(signinUrl).expectStatus(400);
      });

      it('should signin', async () => {
        return pactum
          .spec()
          .post(signinUrl)
          .withBody(dto)
          .expectStatus(200)
          .returns((ctx) => {
            const cookies = ctx.res.headers['set-cookie'];
            const cookie = cookies ? cookies[0] : null;
            return pactum.stash.addDataTemplate({
              cookie: cookie,
            });
          })
          .stores('userAt', '$RETURN');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'ohoh',
          email: 'test@testtest.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmark', () => {
    describe('Get empty bookmark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'http://test.com',
      };

      it('should create bookmarks', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmarks by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'wow',
        description: 'wow-wow',
      };
      it('should edit bookmarks', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmarks', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withCookies(pactum.parse({ '@DATA:TEMPLATE@': 'cookie' }))
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
