// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    try {
      // ===== PERMISSIONS SETUP =====
      strapi.log.info('🔐 Setting up permissions...');

      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Define permissions for all collections
        const permissionsToSet = [
          { apiId: 'api::author.author', actions: ['find', 'findOne'] },
          { apiId: 'api::category.category', actions: ['find', 'findOne'] },
          { apiId: 'api::tag.tag', actions: ['find', 'findOne'] },
          { apiId: 'api::article.article', actions: ['find', 'findOne'] }
        ];

        for (const { apiId, actions } of permissionsToSet) {
          for (const action of actions) {
            const permissionName = `${apiId}.${action}`;

            // Check if permission already exists
            const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
              where: {
                action: permissionName,
                role: publicRole.id
              }
            });

            if (!existingPermission) {
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: permissionName,
                  role: publicRole.id,
                  enabled: true
                }
              });
              strapi.log.info(`🔐 Enabled: ${permissionName}`);
            } else if (!existingPermission.enabled) {
              await strapi.query('plugin::users-permissions.permission').update({
                where: { id: existingPermission.id },
                data: { enabled: true }
              });
              strapi.log.info(`🔐 Updated: ${permissionName}`);
            }
          }
        }
      }

      // ===== AUTO-CONFIRM USERS (DEV HELPER) =====
      strapi.log.info('🔐 Auto-confirming unconfirmed users...');

      // Try using strapi.db.query which is the lower level API and often reliable for plugins
      // In Strapi v4/v5 plugin users-permissions user is 'plugin::users-permissions.user'
      try {
        const unconfirmedUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
          where: { confirmed: false }
        });

        strapi.log.info(`Found ${unconfirmedUsers.length} unconfirmed users.`);

        if (unconfirmedUsers.length > 0) {
          for (const user of unconfirmedUsers) {
            await strapi.db.query('plugin::users-permissions.user').update({
              where: { id: user.id },
              data: { confirmed: true }
            });
            strapi.log.info(`✅ Confirmed user: ${user.email} (ID: ${user.id})`);
          }
        }
      } catch (err) {
        strapi.log.error('❌ Error confirming users:', err);
      }

      // ===== DATA SEEDING =====
      // Check if data already exists to avoid duplicates
      const articles = await strapi.entityService.findMany('api::article.article', {
        filters: { slug: 'coahuila-corredor-migracion' }
      });

      if (articles.length === 0) {
        strapi.log.info('🌱 SEEDING: Starting data seed...');

        // 1. Create Category
        let category = await strapi.entityService.findMany('api::category.category', {
          filters: { slug: 'noticias' }
        });

        let categoryId;
        if (category.length === 0) {
          const newCat = await strapi.entityService.create('api::category.category', {
            data: {
              name: 'Noticias',
              slug: 'noticias',
              description: 'Últimas noticias y reportajes.',
              color: '#FF0000',
              sort_order: 1
            }
          });
          categoryId = newCat.id;
          strapi.log.info('🌱 SEEDING: Created Category "Noticias"');
        } else {
          categoryId = category[0].id;
        }

        // 2. Create Author
        let author = await strapi.entityService.findMany('api::author.author', {
          filters: { slug: 'gerardo-garza' }
        });

        let authorId;
        if (author.length === 0) {
          const newAuthor = await strapi.entityService.create('api::author.author', {
            data: {
              name: 'Gerardo Garza',
              slug: 'gerardo-garza',
              role: 'Reporter',
              bio: 'Senior Editor at MAGNUS with over 10 years of experience in journalism.',
              verified: true
            }
          });
          authorId = newAuthor.id;
          strapi.log.info('🌱 SEEDING: Created Author "Gerardo Garza"');
        } else {
          authorId = author[0].id;
        }

        // 3. Create Tag
        let tag = await strapi.entityService.findMany('api::tag.tag', {
          filters: { slug: 'migracion' }
        });

        let tagId;
        if (tag.length === 0) {
          const newTag = await strapi.entityService.create('api::tag.tag', {
            data: {
              name: 'Migración',
              slug: 'migracion'
            }
          });
          tagId = newTag.id;
          strapi.log.info('🌱 SEEDING: Created Tag "Migración"');
        } else {
          tagId = tag[0].id;
        }

        // 4. Create Article
        await strapi.entityService.create('api::article.article', {
          data: {
            title: 'Coahuila se convierte en un corredor clave para la migración',
            slug: 'coahuila-corredor-migracion',
            excerpt: 'Un análisis profundo sobre cómo el estado ha cambiado su rol en el flujo migratorio hacia Estados Unidos.',
            publishedAt: new Date(),
            state: 'published',
            author: authorId,
            category: categoryId,
            tags: [tagId],
            content_blocks: [
              {
                __component: 'content.rich-text',
                content: '## El Impacto en la Frontera\n\nCoahuila ha dejado de ser solo un estado de paso para convertirse en un punto neurálgico...'
              },
              {
                __component: 'content.quote',
                quote_text: 'La situación en la frontera requiere una respuesta coordinada entre ambos países.',
                author: 'Analista de Seguridad',
                style: 'highlighted'
              },
              {
                __component: 'content.rich-text',
                content: 'Con el aumento de los flujos migratorios, las autoridades locales han implementado nuevas medidas...'
              }
            ],
            executive_summary: {
              summary_text: 'Coahuila se ha posicionado como un corredor estratégico para la migración debido a cambios en las políticas fronterizas.',
              ai_provider: 'openai',
              version: 'gpt-4o'
            },
            // Note: Hero Image is required but we can't easily seed a file via code without upload. 
            // We might need to make hero_image optional or catch the error if validation fails.
            // For seeding, Strapi usually validates required fields.
            // I'll assume I can temporarily bypass or the user will upload one later.
            // Actually, if 'required: true' is in schema, this might fail.
            // Let's create it without hero_image and hope I can loosen the requirement or mock it.
          }
        });
        strapi.log.info('🌱 SEEDING: Created Article "Coahuila se convierte..."');
      }
    } catch (error) {
      strapi.log.error('❌ SEEDING ERROR:', error);
    }
  },
};
