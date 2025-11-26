import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, 
  Shield, 
  Cookie, 
  Eye, 
  FileText, 
  Calendar,
  MapPin,
  Mail
} from "lucide-react";

export default function Legal() {
  const lastUpdated = "2 de agosto de 2024";

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-handwritten text-4xl md:text-6xl font-bold text-chalk-yellow mb-4">
              Información Legal
            </h1>
            <p className="text-lg text-chalk/80">
              Términos de servicio, política de privacidad y información legal de TheCookFlow
            </p>
          </div>

          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-blackboard-light border border-chalk/20">
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:bg-chalk-green data-[state=active]:text-blackboard text-chalk text-xs"
              >
                <Shield className="mr-1" size={14} />
                Privacidad
              </TabsTrigger>
              <TabsTrigger 
                value="terms" 
                className="data-[state=active]:bg-chalk-yellow data-[state=active]:text-blackboard text-chalk text-xs"
              >
                <Scale className="mr-1" size={14} />
                Términos
              </TabsTrigger>
              <TabsTrigger 
                value="cookies" 
                className="data-[state=active]:bg-chalk-red data-[state=active]:text-blackboard text-chalk text-xs"
              >
                <Cookie className="mr-1" size={14} />
                Cookies
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className="data-[state=active]:bg-chalk-green data-[state=active]:text-blackboard text-chalk text-xs"
              >
                <FileText className="mr-1" size={14} />
                Legal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy">
              <Card className="recipe-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-chalk-yellow">
                    <Shield className="mr-2" size={24} />
                    Política de Privacidad
                  </CardTitle>
                  <p className="text-chalk/60 text-sm mt-2">
                    Última actualización: {lastUpdated}
                  </p>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <div className="space-y-6 text-chalk/90">
                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">1. Información que Recopilamos</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="text-chalk font-medium mb-2">Información Personal</h4>
                          <p>Recopilamos información que nos proporcionas directamente, incluyendo:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Nombre y dirección de correo electrónico</li>
                            <li>Preferencias dietéticas y restricciones alimentarias</li>
                            <li>Información de contacto para soporte</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-chalk font-medium mb-2">Información de Uso</h4>
                          <p>Automáticamente recopilamos información sobre cómo usas nuestra aplicación:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Menús generados y preferencias seleccionadas</li>
                            <li>Imágenes subidas para reconocimiento de alimentos</li>
                            <li>Búsquedas de comparación de precios</li>
                            <li>Información de dispositivo y navegador</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">2. Cómo Usamos tu Información</h3>
                      <div className="text-sm space-y-2">
                        <p>Utilizamos la información recopilada para:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Generar menús personalizados basados en tus preferencias</li>
                          <li>Proporcionar reconocimiento de alimentos mediante IA</li>

                          <li>Mejorar nuestros servicios y funcionalidades</li>
                          <li>Comunicarnos contigo sobre tu cuenta y nuestros servicios</li>
                          <li>Cumplir con obligaciones legales</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">3. Compartición de Información</h3>
                      <div className="text-sm space-y-2">
                        <p>No vendemos, alquilamos o compartimos tu información personal con terceros excepto en las siguientes circunstancias:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Con tu consentimiento explícito</li>
                          <li>Para cumplir con obligaciones legales</li>
                          <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                          <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">4. Seguridad de Datos</h3>
                      <div className="text-sm space-y-2">
                        <p>Implementamos medidas de seguridad apropiadas para proteger tu información:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Encriptación de datos en tránsito y en reposo</li>
                          <li>Acceso restringido a información personal</li>
                          <li>Monitoreo regular de seguridad</li>
                          <li>Auditorías de seguridad periódicas</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">5. Tus Derechos (GDPR)</h3>
                      <div className="text-sm space-y-2">
                        <p>Bajo el GDPR, tienes derecho a:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Acceder a tu información personal</li>
                          <li>Rectificar información incorrecta</li>
                          <li>Eliminar tu información personal</li>
                          <li>Restringir el procesamiento de tus datos</li>
                          <li>Portabilidad de datos</li>
                          <li>Oponerte al procesamiento</li>
                        </ul>
                        <p className="mt-3">Para ejercer estos derechos, contáctanos en: <span className="text-chalk-green">privacy@thecookflow.com</span></p>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card className="recipe-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-chalk-yellow">
                    <Scale className="mr-2" size={24} />
                    Términos de Servicio
                  </CardTitle>
                  <p className="text-chalk/60 text-sm mt-2">
                    Última actualización: {lastUpdated}
                  </p>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <div className="space-y-6 text-chalk/90">
                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">1. Aceptación de Términos</h3>
                      <div className="text-sm space-y-2">
                        <p>Al acceder y usar TheCookFlow, aceptas estar sujeto a estos términos de servicio. Si no estás de acuerdo con algún término, no debes usar nuestros servicios.</p>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">2. Descripción del Servicio</h3>
                      <div className="text-sm space-y-2">
                        <p>TheCookFlow es una plataforma de planificación culinaria que ofrece:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Generación de menús semanales personalizados mediante IA</li>
                          <li>Reconocimiento de alimentos por imagen</li>
                          <li>Comparación de precios en supermercados</li>
                          <li>Creación automática de listas de compras</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">3. Uso Aceptable</h3>
                      <div className="text-sm space-y-2">
                        <p>Te comprometes a:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Usar el servicio solo para fines legales y legítimos</li>
                          <li>No intentar acceder a sistemas o datos no autorizados</li>
                          <li>No subir contenido ofensivo, ilegal o inapropiado</li>
                          <li>No interferir con el funcionamiento del servicio</li>
                          <li>Proporcionar información veraz y actualizada</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">4. Propiedad Intelectual</h3>
                      <div className="text-sm space-y-2">
                        <p>TheCookFlow y sus contenidos están protegidos por derechos de autor y otras leyes de propiedad intelectual. Tienes una licencia limitada para usar el servicio según estos términos.</p>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">5. Limitación de Responsabilidad</h3>
                      <div className="text-sm space-y-2">
                        <p>TheCookFlow se proporciona "tal como está". No garantizamos:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>La precisión total de la información nutricional</li>
                          <li>La exactitud de los precios de supermercados</li>
                          <li>El reconocimiento perfecto de alimentos en imágenes</li>
                          <li>La disponibilidad ininterrumpida del servicio</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">6. Modificaciones</h3>
                      <div className="text-sm space-y-2">
                        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos y tu uso continuado constituye aceptación de los nuevos términos.</p>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cookies">
              <Card className="recipe-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-chalk-yellow">
                    <Cookie className="mr-2" size={24} />
                    Política de Cookies
                  </CardTitle>
                  <p className="text-chalk/60 text-sm mt-2">
                    Última actualización: {lastUpdated}
                  </p>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <div className="space-y-6 text-chalk/90">
                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">¿Qué son las Cookies?</h3>
                      <div className="text-sm space-y-2">
                        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia y el funcionamiento de la aplicación.</p>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">Tipos de Cookies que Usamos</h3>
                      <div className="space-y-4 text-sm">
                        <div className="p-4 bg-blackboard rounded-lg border border-chalk/20">
                          <h4 className="text-chalk font-medium mb-2">Cookies Esenciales</h4>
                          <p>Necesarias para el funcionamiento básico del sitio:</p>
                          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Autenticación de sesión</li>
                            <li>Preferencias de idioma</li>
                            <li>Seguridad del sitio</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-blackboard rounded-lg border border-chalk/20">
                          <h4 className="text-chalk font-medium mb-2">Cookies de Funcionalidad</h4>
                          <p>Mejoran tu experiencia recordando tus preferencias:</p>
                          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Preferencias dietéticas guardadas</li>
                            <li>Configuración de la interfaz</li>
                            <li>Historial de búsquedas</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-blackboard rounded-lg border border-chalk/20">
                          <h4 className="text-chalk font-medium mb-2">Cookies Analíticas</h4>
                          <p>Nos ayudan a entender cómo usas la aplicación:</p>
                          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Páginas más visitadas</li>
                            <li>Tiempo de navegación</li>
                            <li>Errores técnicos</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">Control de Cookies</h3>
                      <div className="text-sm space-y-2">
                        <p>Puedes controlar las cookies de varias maneras:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Configuración del navegador para bloquear o eliminar cookies</li>
                          <li>Nuestro panel de preferencias de cookies</li>
                          <li>Extensiones de navegador para gestión de privacidad</li>
                        </ul>
                        <p className="mt-3">
                          <strong>Nota:</strong> Bloquear ciertas cookies puede afectar la funcionalidad del sitio.
                        </p>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal">
              <Card className="recipe-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-chalk-yellow">
                    <FileText className="mr-2" size={24} />
                    Información Legal de la Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 text-chalk/90">
                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-4">Datos de la Empresa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <FileText className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">Razón Social</h4>
                              <p className="text-chalk/70">TheCookFlow Solutions S.L.</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Eye className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">CIF</h4>
                              <p className="text-chalk/70">B12345678</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <MapPin className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">Domicilio Social</h4>
                              <p className="text-chalk/70">
                                Calle Tecnología, 123<br />
                                28001 Madrid, España
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Mail className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">Email de Contacto</h4>
                              <p className="text-chalk/70">legal@thecookflow.com</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Calendar className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">Registro Mercantil</h4>
                              <p className="text-chalk/70">
                                Registro Mercantil de Madrid<br />
                                Tomo 1234, Folio 567, Hoja M-89012
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Scale className="text-chalk-green mt-1" size={16} />
                            <div>
                              <h4 className="font-medium text-chalk">Legislación Aplicable</h4>
                              <p className="text-chalk/70">Ley Española</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">Resolución de Disputas</h3>
                      <div className="text-sm space-y-2">
                        <p>Para cualquier disputa relacionada con estos términos o el uso de TheCookFlow:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Intentaremos resolver cualquier problema de manera amigable</li>
                          <li>Los tribunales de Madrid tendrán jurisdicción exclusiva</li>
                          <li>Se aplicará la legislación española</li>
                          <li>Los consumidores pueden acceder a la plataforma de resolución de disputas en línea de la UE</li>
                        </ul>
                      </div>
                    </section>

                    <Separator className="bg-chalk/20" />

                    <section>
                      <h3 className="text-chalk-green font-semibold text-lg mb-3">Licencias y Reconocimientos</h3>
                      <div className="text-sm space-y-2">
                        <p>TheCookFlow utiliza las siguientes tecnologías y servicios de terceros:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>OpenAI GPT para generación de menús y reconocimiento de alimentos</li>
                          <li>APIs de supermercados para comparación de precios</li>
                          <li>Servicios de almacenamiento en la nube</li>
                          <li>Librerías de código abierto (ver licencias completas en /licenses)</li>
                        </ul>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact for Legal Issues */}
          <Card className="recipe-card mt-8 bg-chalk-green/10 border-chalk-green/30">
            <CardContent className="p-6 text-center">
              <Scale className="mx-auto mb-4 text-chalk-green" size={48} />
              <h3 className="font-handwritten text-xl font-bold text-chalk-green mb-2">
                ¿Tienes Preguntas Legales?
              </h3>
              <p className="text-chalk/80 mb-4">
                Si tienes alguna pregunta sobre estos términos o nuestra política de privacidad, 
                no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:legal@thecookflow.com"
                  className="inline-flex items-center justify-center px-4 py-2 bg-chalk-green text-blackboard rounded-lg hover:bg-opacity-80 transition-all duration-200"
                >
                  <Mail className="mr-2" size={16} />
                  legal@thecookflow.com
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 border border-chalk text-chalk rounded-lg hover:bg-chalk hover:text-blackboard transition-all duration-200"
                >
                  <FileText className="mr-2" size={16} />
                  Formulario de Contacto
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
