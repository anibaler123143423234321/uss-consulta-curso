  -- Horarios reales del ciclo de noviembre 2026 (documentos/HORARIOS NOVIEMBRE.pdf): 50 secciones.
  -- En la base estaban cargados con el ciclo 'setiembre' y con días y cursos equivocados.
  -- Este script borra SOLO esas 45 filas (setiembre 2026) y las de noviembre 2026 si existieran,
  -- y carga las correctas como 'noviembre'. No toca enero ni los cursos.
  -- Es una transacción: si algo falla, no cambia nada.
  BEGIN;
  
  DELETE FROM public.tbl_horarios_cursos
  WHERE anio = 2026 AND ciclo IN ('setiembre', 'noviembre');
  
  INSERT INTO public.tbl_horarios_cursos
    (curso_id, ciclo, anio, seccion, fecha_inicio, fecha_fin, turno, dias, hora_inicio, hora_fin, aula, cupos, cupos_disponibles, publicado)
  SELECT c.id, 'noviembre', 2026, v.seccion, v.fecha_inicio, v.fecha_fin,
         v.turno, v.dias, v.hora_inicio::time, v.hora_fin::time, v.aula, 30, 30, true
  FROM (VALUES
    ('XP-W365', 'PEAD ah', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD ai', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD aj', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD ak', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Miércoles y jueves', '08:00', '12:00', 'Virtual'),
    ('XP-W365', 'PEAD al', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Viernes y sábado', '08:00', '12:00', 'Virtual'),
    ('XP-W365', 'PEAD am', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Lunes y martes', '08:00', '12:00', 'Virtual'),
    ('XP-W365', 'PEAD an', DATE '2026-11-09', DATE '2026-12-19', 'Tarde', 'Viernes y sábado', '15:00', '19:00', 'Virtual'),
    ('XP-W365', 'PEAD ao', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD ap', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD aq', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD ar', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y martes', '19:00', '23:00', 'Virtual'),
    ('XP-W365', 'PEAD as', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-E365', 'PEAD u', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y martes', '19:00', '23:00', 'Virtual'),
    ('XP-E365', 'PEAD v', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Miércoles y jueves', '19:00', '23:00', 'Virtual'),
    ('XP-E365', 'PEAD w', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-E365', 'PEAD x', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Miércoles y jueves', '08:00', '12:00', 'Virtual'),
    ('XP-E365', 'PEAD y', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Viernes y sábado', '08:00', '12:00', 'Virtual'),
    ('XP-E365', 'PEAD z', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y martes', '19:00', '23:00', 'Virtual'),
    ('XP-E365', 'PEAD aa', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD aa', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y martes', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ab', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Miércoles y jueves', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ac', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ad', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Lunes y miércoles', '08:00', '12:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ae', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Martes y jueves', '08:00', '12:00', 'Virtual'),
    ('XP-CANVA', 'PEAD af', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Viernes y sábado', '08:00', '12:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ag', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y martes', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ah', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Miércoles y jueves', '19:00', '23:00', 'Virtual'),
    ('XP-CANVA', 'PEAD ai', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('CERT-EXCEL', 'PEAD k', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('CERT-EXCEL', 'PEAD l', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '23:00', 'Virtual'),
    ('CERT-EXCEL', 'PEAD m', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('CERT-EXCEL', 'PEAD n', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('CERT-EXCEL', 'PEAD o', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Martes y jueves', '08:00', '12:00', 'Virtual'),
    ('CERT-WORD', 'PEAD g', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '23:00', 'Virtual'),
    ('ESP-CAD2D', 'PEAD f', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('ESP-CAD2D', 'PEAD g', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('ESP-CAD3D', 'PEAD e', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '23:00', 'Virtual'),
    ('ESP-CAD3D', 'PEAD f', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('ESP-WEB', 'PEAD c', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('ESP-PBI', 'PEAD c', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '23:00', 'Virtual'),
    ('COMP-02', 'PEAD h', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '22:30', 'Virtual'),
    ('COMP-02', 'PEAD i', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '22:30', 'Virtual'),
    ('COMP-02', 'PEAD b (Mecánica)', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '23:00', 'Virtual'),
    ('COMP-02', 'PEAD b (Arquitectura)', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Lunes y martes', '08:00', '11:30', 'Virtual'),
    ('COMP-03', 'PEAD m', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Lunes y miércoles', '19:00', '22:30', 'Virtual'),
    ('COMP-03', 'PEAD n', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Martes y jueves', '19:00', '22:30', 'Virtual'),
    ('COMP-03', 'PEAD o', DATE '2026-11-09', DATE '2026-12-19', 'Noche', 'Viernes y sábado', '19:00', '22:30', 'Virtual'),
    ('COMP-03', 'PEAD b (Mecánica)', DATE '2026-11-09', DATE '2026-12-19', 'Mañana', 'Jueves y sábado', '08:00', '11:30', 'Virtual'),
    ('CERT-TALLER', 'PEAD D (Word)', DATE '2026-11-11', DATE '2026-11-25', 'Mañana', '11, 18 y 25 de noviembre', '08:30', '10:30', 'Presencial'),
    ('CERT-TALLER', 'PEAD D (Excel)', DATE '2026-11-13', DATE '2026-11-27', 'Mañana', '13, 20 y 27 de noviembre', '08:30', '10:30', 'Presencial')
  ) AS v(code, seccion, fecha_inicio, fecha_fin, turno, dias, hora_inicio, hora_fin, aula)
  JOIN public.tbl_cursos_cinf c ON c.code = v.code;
  
  COMMIT;
  
  -- Comprobación: debe devolver 50 filas en noviembre 2026
  SELECT c.name, COUNT(*) AS secciones
  FROM public.tbl_horarios_cursos h
  JOIN public.tbl_cursos_cinf c ON c.id = h.curso_id
  WHERE h.ciclo = 'noviembre' AND h.anio = 2026
  GROUP BY c.name, c.display_order
  ORDER BY c.display_order;
