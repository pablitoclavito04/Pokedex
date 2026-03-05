package loader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * DataLoader - Puebla la base de datos desde PokeAPI al arrancar la aplicación
 * Solo se ejecuta si la tabla Pokemon está vacía.
 *
 * Pobla en orden:
 *   1. Tipos (18 tipos oficiales)
 *   2. Pokémon + Estadísticas + PokemonTipo  (generaciones 1–3, Pokémon 1-386)
 *   3. Evoluciones
 */
@Component
public class PokeDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PokeDataLoader.class);

    // Cambia este límite si quieres más o menos Pokémon
    private static final int TOTAL_POKEMON = 386;

    private static final String POKEAPI_BASE = "https://pokeapi.co/api/v2";
    private static final String SPECIES_BASE  = POKEAPI_BASE + "/pokemon-species";

    @PersistenceContext
    private EntityManager em;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Mapa nombre-en-inglés → nombre en español (tipos)
    private static final Map<String, String> TIPO_NOMBRES_ES = new LinkedHashMap<>();
    static {
        TIPO_NOMBRES_ES.put("normal",   "Normal");
        TIPO_NOMBRES_ES.put("fire",     "Fuego");
        TIPO_NOMBRES_ES.put("water",    "Agua");
        TIPO_NOMBRES_ES.put("electric", "Eléctrico");
        TIPO_NOMBRES_ES.put("grass",    "Planta");
        TIPO_NOMBRES_ES.put("ice",      "Hielo");
        TIPO_NOMBRES_ES.put("fighting", "Lucha");
        TIPO_NOMBRES_ES.put("poison",   "Veneno");
        TIPO_NOMBRES_ES.put("ground",   "Tierra");
        TIPO_NOMBRES_ES.put("flying",   "Volador");
        TIPO_NOMBRES_ES.put("psychic",  "Psíquico");
        TIPO_NOMBRES_ES.put("bug",      "Bicho");
        TIPO_NOMBRES_ES.put("rock",     "Roca");
        TIPO_NOMBRES_ES.put("ghost",    "Fantasma");
        TIPO_NOMBRES_ES.put("dragon",   "Dragón");
        TIPO_NOMBRES_ES.put("dark",     "Siniestro");
        TIPO_NOMBRES_ES.put("steel",    "Acero");
        TIPO_NOMBRES_ES.put("fairy",    "Hada");
    }

    // Colores hex por tipo
    private static final Map<String, String> TIPO_COLORES = new HashMap<>();
    static {
        TIPO_COLORES.put("normal",   "#A8A878");
        TIPO_COLORES.put("fire",     "#F08030");
        TIPO_COLORES.put("water",    "#6890F0");
        TIPO_COLORES.put("electric", "#F8D030");
        TIPO_COLORES.put("grass",    "#78C850");
        TIPO_COLORES.put("ice",      "#98D8D8");
        TIPO_COLORES.put("fighting", "#C03028");
        TIPO_COLORES.put("poison",   "#A040A0");
        TIPO_COLORES.put("ground",   "#E0C068");
        TIPO_COLORES.put("flying",   "#A890F0");
        TIPO_COLORES.put("psychic",  "#F85888");
        TIPO_COLORES.put("bug",      "#A8B820");
        TIPO_COLORES.put("rock",     "#B8A038");
        TIPO_COLORES.put("ghost",    "#705898");
        TIPO_COLORES.put("dragon",   "#7038F8");
        TIPO_COLORES.put("dark",     "#705848");
        TIPO_COLORES.put("steel",    "#B8B8D0");
        TIPO_COLORES.put("fairy",    "#EE99AC");
    }

    @Override
    public void run(String... args) throws Exception {
        Long count = (Long) em.createQuery("SELECT COUNT(p) FROM Pokemon p").getSingleResult();
        if (count > 0) {
            log.info("La base de datos ya tiene {} Pokémon. Saltando DataLoader.", count);
            return;
        }

        log.info("Base de datos vacía. Iniciando carga desde PokeAPI...");

        cargarTipos();
        Map<Integer, Integer> pokemonIdMap = cargarPokemon();
        cargarEvoluciones(pokemonIdMap);

        log.info("¡Carga completada! {} Pokémon importados.", TOTAL_POKEMON);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. TIPOS
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void cargarTipos() {
        log.info("Cargando 18 tipos...");
        for (Map.Entry<String, String> entry : TIPO_NOMBRES_ES.entrySet()) {
            String key   = entry.getKey();
            String nombre = entry.getValue();
            Tipo tipo = new Tipo();
            tipo.setNombre(nombre);
            tipo.setIcono(key);
            tipo.setColor(TIPO_COLORES.getOrDefault(key, "#888888"));
            em.persist(tipo);
        }
        em.flush();
        log.info("18 tipos cargados.");
    }

    // ─────────────────────────────────────────────────────────────
    // 2. POKÉMON + ESTADÍSTICAS + POKEMON_TIPO
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public Map<Integer, Integer> cargarPokemon() throws Exception {
        // Mapa: nombre-tipo-en → idTipo en BD
        Map<String, Integer> tipoIdMap = construirTipoIdMap();
        // Mapa: número-nacional → idPokemon en BD (para evoluciones)
        Map<Integer, Integer> pokemonIdMap = new HashMap<>();

        for (int numero = 1; numero <= TOTAL_POKEMON; numero++) {
            try {
                JsonNode pokeData    = fetchJson(POKEAPI_BASE + "/pokemon/" + numero);
                JsonNode speciesData = fetchJson(SPECIES_BASE + "/" + numero);

                // ── Nombre en español ──
                String nombre = extraerNombreEs(speciesData, pokeData.get("name").asText());

                // ── Altura y peso ──
                BigDecimal altura = BigDecimal.valueOf(pokeData.get("height").asDouble() / 10)
                        .setScale(2, RoundingMode.HALF_UP);
                BigDecimal peso = BigDecimal.valueOf(pokeData.get("weight").asDouble() / 10)
                        .setScale(2, RoundingMode.HALF_UP);

                // ── Descripción en español ──
                String descripcion = extraerDescripcionEs(speciesData, nombre);

                // ── Imagen ──
                String imagenUrl = pokeData.path("sprites")
                        .path("other").path("official-artwork")
                        .path("front_default").asText(
                                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + numero + ".png"
                        );

                // ── Generación ──
                String genUrl   = speciesData.path("generation").path("url").asText("");
                int generacion  = extraerGeneracion(genUrl);

                // ── Persistir Pokemon ──
                Pokemon pokemon = new Pokemon();
                pokemon.setNumero(numero);
                pokemon.setNombre(nombre);
                pokemon.setAltura(altura);
                pokemon.setPeso(peso);
                pokemon.setDescripcion(descripcion);
                pokemon.setImagenUrl(imagenUrl);
                pokemon.setGeneracion(generacion);
                em.persist(pokemon);
                em.flush();

                pokemonIdMap.put(numero, pokemon.getId());

                // ── Estadísticas ──
                JsonNode stats = pokeData.get("stats");
                Estadisticas est = new Estadisticas();
                est.setIdPokemon(pokemon.getId());
                for (JsonNode stat : stats) {
                    String statName = stat.path("stat").path("name").asText();
                    int valor = stat.path("base_stat").asInt();
                    switch (statName) {
                        case "hp"              -> est.setPs(valor);
                        case "attack"          -> est.setAtaque(valor);
                        case "defense"         -> est.setDefensa(valor);
                        case "speed"           -> est.setVelocidad(valor);
                        case "special-attack"  -> est.setAtaqueEspecial(valor);
                        case "special-defense" -> est.setDefensaEspecial(valor);
                    }
                }
                em.persist(est);

                // ── Tipos ──
                JsonNode tipos = pokeData.get("types");
                for (JsonNode tipoNode : tipos) {
                    String tipoNombreEn = tipoNode.path("type").path("name").asText();
                    int orden           = tipoNode.path("slot").asInt();
                    Integer tipoId      = tipoIdMap.get(tipoNombreEn);
                    if (tipoId != null) {
                        PokemonTipo pt = new PokemonTipo(pokemon.getId(), tipoId, (byte) orden);
                        em.persist(pt);
                    }
                }

                em.flush();

                if (numero % 50 == 0) {
                    log.info("  → {} / {} Pokémon cargados...", numero, TOTAL_POKEMON);
                    em.clear(); // liberar memoria
                }

            } catch (Exception e) {
                log.warn("Error cargando Pokémon #{}: {}", numero, e.getMessage());
            }
        }

        return pokemonIdMap;
    }

    // ─────────────────────────────────────────────────────────────
    // 3. EVOLUCIONES
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void cargarEvoluciones(Map<Integer, Integer> pokemonIdMap) throws Exception {
        log.info("Cargando cadenas de evolución...");
        Set<String> procesadas = new HashSet<>();

        for (int numero = 1; numero <= TOTAL_POKEMON; numero++) {
            try {
                JsonNode speciesData = fetchJson(SPECIES_BASE + "/" + numero);
                String chainUrl = speciesData.path("evolution_chain").path("url").asText("");

                if (chainUrl.isEmpty() || procesadas.contains(chainUrl)) continue;
                procesadas.add(chainUrl);

                JsonNode chainData = fetchJson(chainUrl);
                procesarCadena(chainData.path("chain"), pokemonIdMap);

            } catch (Exception e) {
                log.warn("Error cargando evolución para #{}: {}", numero, e.getMessage());
            }
        }

        log.info("Evoluciones cargadas.");
    }

    private void procesarCadena(JsonNode nodo, Map<Integer, Integer> pokemonIdMap) {
        JsonNode evolvesTo = nodo.path("evolves_to");
        if (evolvesTo.isEmpty()) return;

        String origenUrl   = nodo.path("species").path("url").asText("");
        int origenNumero   = extraerIdDeUrl(origenUrl);
        Integer origenBdId = pokemonIdMap.get(origenNumero);

        for (JsonNode siguiente : evolvesTo) {
            String destinoUrl   = siguiente.path("species").path("url").asText("");
            int destinoNumero   = extraerIdDeUrl(destinoUrl);
            Integer destinoBdId = pokemonIdMap.get(destinoNumero);

            if (origenBdId != null && destinoBdId != null) {
                JsonNode detalle = siguiente.path("evolution_details");
                int nivel  = 0;
                String metodo = "Nivel";

                if (!detalle.isEmpty()) {
                    JsonNode d = detalle.get(0);
                    nivel  = d.path("min_level").asInt(0);
                    String trigger = d.path("trigger").path("name").asText("level-up");
                    metodo = switch (trigger) {
                        case "level-up"   -> nivel > 0 ? "Nivel " + nivel : "Nivel";
                        case "trade"      -> "Intercambio";
                        case "use-item"   -> "Objeto: " + d.path("item").path("name").asText("");
                        case "shed"       -> "Muda";
                        default           -> trigger;
                    };
                }

                Evolucion evo = new Evolucion();
                evo.setPokemonOrigenId(origenBdId);
                evo.setPokemonDestinoId(destinoBdId);
                evo.setNivelEvolucion(nivel > 0 ? nivel : null);
                evo.setMetodo(metodo);
                em.persist(evo);
            }

            // Recursivo para cadenas de 3 eslabones
            procesarCadena(siguiente, pokemonIdMap);
        }
        em.flush();
    }

    // ─────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────

    private JsonNode fetchJson(String url) throws Exception {
        String json = restTemplate.getForObject(url, String.class);
        return mapper.readTree(json);
    }

    private Map<String, Integer> construirTipoIdMap() {
        Map<String, Integer> mapa = new HashMap<>();
        List<Tipo> tipos = em.createQuery("SELECT t FROM Tipo t", Tipo.class).getResultList();
        // Mapa invertido: nombre-es → id; también necesitamos en → id
        Map<String, String> esAEn = new HashMap<>();
        TIPO_NOMBRES_ES.forEach((en, es) -> esAEn.put(es, en));
        for (Tipo t : tipos) {
            String en = esAEn.get(t.getNombre());
            if (en != null) mapa.put(en, t.getId());
        }
        return mapa;
    }

    private String extraerNombreEs(JsonNode speciesData, String fallback) {
        JsonNode names = speciesData.path("names");
        for (JsonNode n : names) {
            if ("es".equals(n.path("language").path("name").asText())) {
                return n.path("name").asText(fallback);
            }
        }
        // capitalizar fallback
        return Character.toUpperCase(fallback.charAt(0)) + fallback.substring(1);
    }

    private String extraerDescripcionEs(JsonNode speciesData, String nombreFallback) {
        JsonNode entries = speciesData.path("flavor_text_entries");
        // Intentar español primero
        for (JsonNode e : entries) {
            if ("es".equals(e.path("language").path("name").asText())) {
                return e.path("flavor_text").asText("").replace("\n", " ").replace("\f", " ").trim();
            }
        }
        // Fallback inglés
        for (JsonNode e : entries) {
            if ("en".equals(e.path("language").path("name").asText())) {
                return e.path("flavor_text").asText("").replace("\n", " ").replace("\f", " ").trim();
            }
        }
        return "Pokémon " + nombreFallback;
    }

    private int extraerGeneracion(String url) {
        // URL: https://pokeapi.co/api/v2/generation/1/
        if (url == null || url.isEmpty()) return 1;
        String[] parts = url.split("/");
        try {
            return Integer.parseInt(parts[parts.length - 1]);
        } catch (NumberFormatException e) {
            return 1;
        }
    }

    private int extraerIdDeUrl(String url) {
        if (url == null || url.isEmpty()) return -1;
        String[] parts = url.split("/");
        try {
            return Integer.parseInt(parts[parts.length - 1]);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}